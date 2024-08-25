import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());

const server = createServer(app); // Create an HTTP server

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Basic Socket.IO event handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("send_message event triggered!", data);
    // broadcast.emit sends emits to everyone beside you.
    socket.broadcast.emit("receive_message", data);
  });

  //   socket.on("message", (msg) => {
  //     console.log("Message received:", msg);
  //     socket.emit("message", `Echo: ${msg}`); // Echo the message back to the client
  //   });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Define an Express route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "content from server" });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
