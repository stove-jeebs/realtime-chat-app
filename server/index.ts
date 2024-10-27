import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import {
  getSupabaseMessage,
  saveSupabaseMessage,
} from './services/supabaseUtils';

const app = express();
const port = 4000;
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://realtime-chat-app-wuf7.onrender.com',
    ],
    methods: ['GET', 'POST'],
  },
});

interface User {
  id: string;
  username: string;
  room: string;
}

export interface ChatMessage {
  username: string;
  message: string;
  room: string;
  timestamp: string;
}

let allUsers: User[] = [];
let chatRoom = '';

function getRoomUsers(room: string): User[] {
  return allUsers.filter((user: User) => user.room == room);
}

io.on('connection', (socket: Socket) => {
  socket.on('room:join', async ({ id, username, room }: User) => {
    socket.join(room); // join the user to the socket room
    allUsers.push({ id, username, room }); // add user to the allUsers array
    chatRoom = room;

    const joinMessage: ChatMessage = {
      username: 'ChatBot',
      message: `${username} has joined!`,
      room: room,
      timestamp: new Date().toISOString(),
    };

    // get all previous messages from supabase
    const chatHistory: ChatMessage[] = await getSupabaseMessage(room);
    const displayMessage = [...chatHistory, joinMessage];

    // send message to all users in the room, including the user
    io.to(room).emit('chat:history', displayMessage);

    // list all the users in the room
    const chatRoomUsers = getRoomUsers(room);
    io.to(room).emit('room:list_users', chatRoomUsers);
  });

  socket.on('chat:send', async (msg: ChatMessage): Promise<void> => {
    // insert messages into supabase
    saveSupabaseMessage(msg, socket);
    io.to(msg.room).emit('chat:receive', msg);
  });

  socket.on('room:leave', () => {
    socket.leave(chatRoom);
    allUsers = allUsers.filter((user: User) => user.id != socket.id);
    const chatRoomUsers: User[] = getRoomUsers(chatRoom);
    io.to(chatRoom).emit('room:list_users', chatRoomUsers);
  });

  socket.on('disconnect', () => {
    socket.leave(chatRoom);
    allUsers = allUsers.filter((user: User) => user.id != socket.id);
    const chatRoomUsers: User[] = getRoomUsers(chatRoom);
    io.to(chatRoom).emit('room:list_users', chatRoomUsers);
  });
});

server.listen(port, () => `server is running on port ${port}`);
