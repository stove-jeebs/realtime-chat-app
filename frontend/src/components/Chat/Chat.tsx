import { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';
import styles from './Chat.module.css';
import Room from '../Room/Room';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  username: string;
  message: string;
  room: string;
  timestamp: string;
}

interface ChatProps {
  socket: Socket;
  username: string;
  room: string;
}

export default function Chat({ socket, username, room }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || !room) {
      console.log('Username or room missing. Redirecting to home.');
      navigate('/', { replace: true });
    }
  }, [username, room, navigate]);

  useEffect(() => {
    socket.on('chat:receive', (message: ChatMessage): void => {
      setMessages((prevMessages: ChatMessage[]): ChatMessage[] => [
        ...prevMessages,
        message,
      ]);
    });

    socket.on('chat:history', (messages: ChatMessage[]): void => {
      setMessages(messages);
    });

    // clean up listener when component unmounts to prevent memory leaks
    return (): void => {
      socket.off(`chat:receive`);
      socket.off('chat:history');
    };
  }, [socket]);

  useEffect(() => {
    messagesRef.current?.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages]);

  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  function sendMessage(): void {
    if (message !== '') {
      const timestamp = new Date().toISOString();
      socket.emit('chat:send', { username, room, message, timestamp });
      setMessage('');
    }
  }

  return (
    <>
      <Room socket={socket} room={room} />

      <div className={styles.chat}>
        {/* message container */}
        <div className={styles.messagesContainer} ref={messagesRef}>
          {messages.map((msg: ChatMessage, index: number) => (
            <div key={index} className={styles.message}>
              <div>
                <span>{msg.username}</span>
                <span>{formatDate(msg.timestamp)}</span>
              </div>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>

        {/* send message */}
        <div className={styles.sendMessageContainer}>
          <input
            className={styles.input}
            type="text"
            placeholder="Message here..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            value={message} // controlled by react state so it can be reset after sending message
          />
          <button
            type="button"
            className={styles.sendMessageButton}
            onClick={sendMessage}
          >
            Send Message
          </button>
        </div>
      </div>
    </>
  );
}
