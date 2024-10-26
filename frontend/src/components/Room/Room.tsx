import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface User {
  id: string;
  username: string;
  room: string;
}

interface RoomProps {
  socket: Socket;
  room: string;
}

export default function Room({ socket, room }: RoomProps) {
  const [roomUsers, setRoomUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('room:list_users', (users: User[]) => setRoomUsers(users));
    return () => {
      socket.off(`room:list_users`);
    };
  }, [socket]);

  function leaveRoom(): void {
    socket.emit('room:leave', room);
    navigate('/', { replace: true });
  }
  return (
    <div>
      <h1>{room}</h1>
      <div>
        <h2>Users</h2>
        <ul>
          {roomUsers.map((user: User, index: number) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
      </div>
      <button onClick={leaveRoom}>Leave</button>
    </div>
  );
}
