import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const roomId = "67c1e6408f4716aacf953332";
const userId = "679bfbb882d1a9e68af9d2dd";

// Join Room
socket.emit("joinRoom", { roomId, userId });

// Listen for messages
socket.on("message", (data) => {
    console.log("Message:", data);
});

// Send Message
setTimeout(() => {
    socket.emit("sendMessage", { roomId, userId, content: "Hello from Node.js client!" });
}, 3000);

// Leave Room after 6 seconds
setTimeout(() => {
    socket.emit("leaveRoom", { roomId, userId });
}, 6000);
