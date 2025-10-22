// src/app/api/socket/route.ts
import { Server } from "socket.io";
import { NextResponse } from "next/server";

export const GET = (req: Request) => {
  return NextResponse.json({ message: "Socket endpoint active" });
};

// Socket.io setup
let io: Server | undefined;

export default function handler(req: any, res: any) {
  if (!io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      transports: ["websocket"],
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Example: send dummy data every second
      const interval = setInterval(() => {
        socket.emit("data", { timestamp: Date.now(), value: Math.random() * 100 });
      }, 1000);

      socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
      });
    });
  }

  // Required by Next.js to signal that the socket is set up
  res.end();
}


