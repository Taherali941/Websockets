// client/src/App.js
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { encryptMessage, decryptMessage } from "./crypto";
import "./App.css";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [userId, setUserId] = useState("");

  const chatEndRef = useRef(null); //  for auto scroll

  useEffect(() => {
    const handleId = (id) => setUserId(id);

    const handleMessage = (data) => {
      const decrypted = decryptMessage(data.message);
      setChat((prev) => [
        ...prev,
        { user: data.user, message: decrypted },
      ]);
    };

    socket.on("your-id", handleId);
    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("your-id", handleId);
      socket.off("receive-message", handleMessage);
    };
  }, []);

  //  Auto scroll when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const encrypted = encryptMessage(message);
    socket.emit("send-message", encrypted);
    setMessage("");
  };

  return (
    <div className="container">
      <h3>Your ID: {userId}</h3>

      <div className="chat-box">
        {chat.map((msg, index) => {
          const isMe = msg.user === userId;

          return (
            <div
              key={index}
              className={`message ${isMe ? "me" : "other"}`}
            >
              <div className="user">{msg.user}</div>
              <div>{msg.message}</div>
            </div>
          );
        })}

        {/* invisible div to scroll to */}
        <div ref={chatEndRef} />
      </div>

      <div className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;