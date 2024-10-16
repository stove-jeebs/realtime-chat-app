// import { useState } from 'react'
import './home.css'
import { Socket } from 'socket.io-client';

interface HomeProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket;
}

	export default function Home({ username, setUsername, room, setRoom, socket  }: HomeProps) {
	// const [count, setCount] = useState(0);
	return (
		<div id="home">
			<h1>Home Page</h1>
			<form>
				<input type="text" placeholder="Username..." value={username} onChange={e => setUsername(e.target.value)}/>
				<select name="rooms" id="rooms">
					<option value="">--Select Room--</option>
					<option value="1">1</option>
					<option value="2">2</option>
				</select>
				<button onClick={() => socket.emit('join_room', room)}>Join Room</button>
			</form>
		</div>
	)
}
