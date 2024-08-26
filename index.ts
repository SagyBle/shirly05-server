import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connection:", socket.id);
  socket.on("disconnect", () => {
    console.log("disconnect:", "system left", socket.id);
  });

  socket.on("join_room", (data) => {
    if (socket.rooms.has(data.roomNumber)) {
      console.log(`User ${socket.id} is already in room ${data.roomNumber}`);
    } else {
      socket.join(data.roomNumber);
      console.log("user", socket.id, "joined room:", data.roomNumber);
    }
  });

  socket.on("leave_room", (data) => {
    console.log("user", socket.id, "left room:", data.roomNumber);
    if (socket.rooms.has(data.roomNumber)) {
      socket.leave(data.roomNumber);
      console.log("user", socket.id, "left room:", data.roomNumber);
    } else {
      console.log(`User ${socket.id} is not logged to room ${data.roomNumber}`);
    }
  });

  socket.on("send_message", (data) => {
    console.log("send_message event triggered!", data);
    if (socket.rooms.has(data.joinRoomNumber)) {
      socket.to(data.joinRoomNumber).emit("receive_message", data);
    }
  });

  socket.on("disconnecting", () => {
    console.log("disconnecting", "room left", socket.id); // the Set
  });
});

// Define an Express route
app.get("/", (req: Request, res: Response) => {
  console.log("Get header request");

  res.json({ message: "content from server" });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
