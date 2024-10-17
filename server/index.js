"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const port = 4000;
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        // credentials: true,
    },
});
io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`);
    socket.on('join', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
    });
    socket.on('sendMessage', (msg) => {
        io.to(msg.room).emit('message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
app.get('/', (req, res) => {
    res.send('Hello world');
});
server.listen(port, () => "server is running on port 4000");
