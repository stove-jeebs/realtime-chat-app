import { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';

import Chat from './components/Chat/Chat';
import Home from './components/Home/Home';

const socket = io(import.meta.env.VITE_SOCKET_URL);

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  return (
    <Router>
      <div id="app">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
            path="/chat"
            element={<Chat socket={socket} username={username} room={room} />}
          />
          <Route path="*" element={<h1>Page Not Found</h1>} /> {/* 404 page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
