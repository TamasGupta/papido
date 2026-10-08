import crypto from "crypto";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

// Verifies Razorpay's webhook signature, then confirms the payment server-side.
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (secret) {
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    if (expected !== signature) return fail("BAD_SIGNATURE", "Invalid signature", 400);
  } else if (process.env.NODE_ENV === "production") {
    return fail("NO_WEBHOOK_SECRET", "Webhook secret not configured", 500);
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return fail("BAD_PAYLOAD", "Invalid JSON", 400);
  }

  const paymentId = event?.payload?.payment?.entity?.id;
  const status = event?.event === "payment.captured" ? "SUCCESS" : event?.event === "payment.failed" ? "FAILED" : null;
  if (!status || !paymentId) return ok({}, "Ignored");

  const payment = await db.payment.findFirst({ where: { ref: paymentId } });
  if (!payment) return fail("PAYMENT_NOT_FOUND", "Unknown payment", 404);

  await db.payment.update({ where: { id: payment.id }, data: { status } });
  await db.ride.update({
    where: { id: payment.rideId },
    data: { paymentStatus: status === "SUCCESS" ? "SUCCESS" : "FAILED", status: status === "SUCCESS" ? "PAYMENT_COMPLETED" : "PAYMENT_FAILED" },
  });
  return ok({}, "Webhook processed");
}
