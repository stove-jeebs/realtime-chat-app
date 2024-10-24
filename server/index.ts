import cors from 'cors';
import express from 'express';
import http from 'http';
import supabase from './services/supabase';
import { Server, Socket } from 'socket.io';

const app = express();
const port = 4000;
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

interface User {
  id: string;
  username: string;
  room: string;
}

interface ChatMessage {
  username: string;
  message: string;
  room: string;
  timestamp: string;
}

const allUsers: User[] = [];

io.on('connection', (socket: Socket) => {
  console.log(`a user connected ${socket.id}`);

  socket.on('joinRoom', ({ id, username, room }: User) => {
    socket.join(room); // join the user to the socket room
    allUsers.push({ id, username, room }); // add user to the allUsers array

    const joinMessage: ChatMessage = {
      username: 'ChatBot',
      message: `${username} has joined!`,
      room: room,
      timestamp: new Date().toISOString(),
    };

    // send message to all users in the room, including the user
    io.to(room).emit('receiveMessage', joinMessage);
    console.log(`${username} joined room ${room}`);

    const chatRoomUsers: User[] = allUsers.filter((user) => user.room === room);
    socket.emit('chatroom_users', chatRoomUsers); // list all the users in the room
  });

  socket.on('sendMessage', async (msg: ChatMessage) => {
    const { username, message, room, timestamp }: ChatMessage = msg;
    // insert messages into supabase
    const { error } = await supabase.from('messages').insert({
      username: username,
      message: message,
      room: room,
      timestamp: timestamp,
    });
    if (error) {
      console.error('Error inserting message:', error);
      // Optionally, inform the client about the error
      socket.emit('errorMessage', 'Failed to send message.');
      return;
    }
    io.to(room).emit('receiveMessage', msg);
  });

  socket.on('disconnect', () => {
    const userIndex = allUsers.findIndex((user) => user.id === socket.id);
    if (userIndex !== -1) allUsers.splice(userIndex, 1);
    console.log('user disconnected');
  });
});

server.listen(port, () => `server is running on port ${port}`);
