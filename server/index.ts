import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';

const app = express();
const port = 4000;
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    // credentials: true,
  },
});

interface User {
  id: string;
  username: string;
  room: string;
}

interface Message {
  username: string;
  message: string;
  room: string;
  timestamp: Date;
}

const allUsers: User[] = [];

io.on('connection', (socket: Socket) => {
  console.log(`a user connected ${socket.id}`);

  socket.on('joinRoom', ({ id, username, room }: User) => {
    socket.join(room); // join the user to the socket room
    allUsers.push({ id, username, room }); // add user to the allUsers array

    const joinMessage: Message = {
      username: 'ChatBot',
      message: `${username} has joined!`,
      room: room,
      timestamp: new Date(),
    };

    // send message to al users in the room
    socket.to(room).emit('receiveMessage', joinMessage);
    console.log(`${username} joined room ${room}`);

    const chatRoomUsers: User[] = allUsers.filter((user) => user.room === room);
    socket.emit('chatroom_users', chatRoomUsers); // list all the users in the room
  });

  socket.on('sendMessage', (msg) => {
    io.to(msg.room).emit('message', msg);
  });

  socket.on('disconnect', () => {
    const userIndex = allUsers.findIndex((user) => user.id === socket.id);
    allUsers.splice(userIndex, 1);
    console.log('user disconnected');
  });
});

server.listen(port, () => 'server is running on port 4000');
