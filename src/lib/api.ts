import { NextResponse } from "next/server";

export function ok(data: unknown, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function fail(code: string, message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}
