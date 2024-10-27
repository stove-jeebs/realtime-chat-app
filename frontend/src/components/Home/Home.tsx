import styles from './Home.module.css';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface HomeProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket;
}

export default function Home({
  username,
  setUsername,
  room,
  setRoom,
  socket,
}: HomeProps) {
  const navigate = useNavigate();
  function joinRoom(): void {
    if (room !== '' && username !== '')
      socket.emit('room:join', {
        id: socket.id,
        username: username,
        room: room,
      });
    navigate('/chat', { replace: true }); // replace current url with new one
  }

  return (
    <div className={styles.home}>
      <h1>Home Page</h1>

      <input
        className={styles.input}
        type="text"
        placeholder="Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <select
        className={styles.input}
        name="rooms"
        onChange={(e) => setRoom(e.target.value)}
      >
        <option value="">--Select Room--</option>
        <option value="room1">Room 1</option>
        <option value="room2">Room 2</option>
        <option value="room3">Room 3</option>
      </select>
      <button className={styles.button} onClick={joinRoom}>
        Join Room
      </button>
    </div>
  );
}
