// const http = require('http');
// const express = require('express');
// const path = require('path');
// const { Server } = require('socket.io');

// const app = express()
// const server = http.createServer(app)
// const io = new Server(server)

// //socket io
// io.on('connection',(socket)=>{
//     console.log("a new user is connected",socket.id,handshake.time)
//     socket.on('user-message',(message)=>{
//         io.emit('message',message)
//     })
// })

// app.use(express.static(path.resolve('./public')))
// app.get('/',(req,res)=>{
//     return res.sendFile('/public/index.html')
// })

// server.listen(3000,()=>{
//     console.log(`app is running on port`)
// })





/////////////////////////////////////////////////////////////////////////////////////////////

// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { decryptMessage } = require("./crypto");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store users
let users = {};

io.on("connection", (socket) => {
  // Generate unique ID
  const userId = "User_" + Math.random().toString(36).substr(2, 5);
  users[socket.id] = userId;

  console.log(userId, "connected");

  // Send ID to user
  socket.emit("your-id", userId);

  // Listen for messages
socket.on("send-message", (encryptedMessage) => {
  try {
    const decrypted = decryptMessage(encryptedMessage);

    console.log("Decrypted:", decrypted);

    io.emit("receive-message", {
      user: userId,
      message: encryptedMessage,
    });
  } catch (err) {
    console.error("Decryption failed:", err.message);
  }
});

  socket.on("disconnect", () => {
    console.log(users[socket.id], "disconnected");
    delete users[socket.id];
  });
});

server.listen(4000, () => {
  console.log("Server running on port 4000");
});