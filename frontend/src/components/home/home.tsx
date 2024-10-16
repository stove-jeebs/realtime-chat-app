import styles from './home.module.css';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

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
  const joinRoom = () => {
    if (room !== '' && username !== '')
      socket.emit('join_room', { username: username, room: room });
    navigate('/chat', { replace: true }); // replace current url with new one
  };
  return (
    <div className={styles.home}>
      <h1>Home Page</h1>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <select
          name="rooms"
          id="rooms"
          onChange={(e) => setRoom(e.target.value)}
        >
          <option value="">--Select Room--</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}
