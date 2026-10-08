import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("ride:join", (rideId) => socket.join(`ride:${rideId}`));
  socket.on("rider:location", ({ rideId, lat, lng }) => {
    socket.to(`ride:${rideId}`).emit("rider:location_updated", { lat, lng });
  });
  socket.on("ride:event", ({ rideId, type, meta }) => {
    socket.to(`ride:${rideId}`).emit(type, meta);
  });
});

const port = process.env.PORT || process.env.SOCKET_PORT || 4000;
httpServer.listen(port, () => console.log(`Socket.IO on :${port}`));

