import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Message from "./models/MessagesModel.js"; // Corrected import path

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map(); // Store userId -> socketId mapping

  // Middleware for Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("❌ No token provided. Rejecting connection.");
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // Attach user details to socket
      console.log(`✅ User authenticated: ${decoded.userId}`);
      next();
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user?.userId;

    if (!userId) {
      console.log("❌ Invalid user. Disconnecting socket.");
      socket.disconnect();
      return;
    }

    // Store user in the map
    userSocketMap.set(userId, socket.id);
    console.log(`🔗 User Connected: ${userId} | Socket ID: ${socket.id}`);
    console.log("👀 Current userSocketMap:", Array.from(userSocketMap.entries()));

    // Notify all users about the new connection
    io.emit("user_connected", { userId, socketId: socket.id });

    // Listen for direct messages
    socket.on("sendMessage", async ({ sender, recipient, messageType, content }) => {
      console.log("📩 Received sendMessage event:", { sender, recipient, content });
// Validate sender & recipient
if (!sender || typeof sender !== "object" || !sender._id || !mongoose.Types.ObjectId.isValid(sender._id)) {
  console.log(`❌ Invalid sender ObjectId: ${JSON.stringify(sender, null, 2)}`);
  return;
}

if (!recipient || typeof recipient !== "object" || !recipient._id || !mongoose.Types.ObjectId.isValid(recipient._id)) {
  console.log(`❌ Invalid recipient ObjectId: ${JSON.stringify(recipient, null, 2)}`);
  return;
}
console.log(`🆔 Sender ID: ${sender._id}, Recipient ID: ${recipient._id}`);
if (sender._id === recipient._id) {
  console.warn("⚠️ Sender and recipient are the same. Ignoring message to prevent self-message issue.");
  return;
}


      try {
        // Save message in database
        const newMessage = await Message.create({
          sender: sender._id,
          recipient: recipient._id,
          messageType,
          content,
        });

        // Populate sender & recipient details
        const messageData = await Message.findById(newMessage._id)
          .populate("sender", "id email name image color")
          .populate("recipient", "id email name image color");

        const recipientSocketId = userSocketMap.get(recipient._id);
        const senderSocketId = userSocketMap.get(sender._id);

        console.log("📡 Recipient Socket ID:", recipientSocketId);
        console.log("📡 Sender Socket ID:", senderSocketId);

        // Send message to recipient if online
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveMessage", messageData);
          console.log(`✅ Message delivered to recipient ${recipient._id}`);
        } else {
          console.log(`⚠️ Recipient ${recipient._id} is offline. Message saved.`);
        }

        // Send message back to sender for confirmation
        if (senderSocketId) {
          io.to(senderSocketId).emit("receiveMessage", messageData);
          console.log(`📨 Confirmation sent to sender ${sender._id}`);
        }
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }
    });

    // Handle User Disconnection
    socket.on("disconnect", () => {
      console.log(`❌ User Disconnected: ${userId} | Socket ID: ${socket.id}`);
      userSocketMap.delete(userId);
      io.emit("user_disconnected", { userId });
      console.log("👀 Updated userSocketMap:", Array.from(userSocketMap.entries()));
    });
  });
};

export default setupSocket;