import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import styles from './chat.module.css';

interface ChatMessage {
  username: string;
  message: string;
  room: string;
  timestamp: Date;
}

export default function Message({ socket }: { socket: Socket }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.on('receiveMessage', (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // clean up listener when component unmounts to prevent memory leaks
    return () => {
      socket.off('receiveMessage');
    };
  }, [socket]);

  function formatDate(timestamp: Date): string {
    return timestamp.toLocaleString();
  }

  return (
    <div className={styles.messageContainer}>
      {messages.map((message, index) => (
        <div key={index} className={styles.message}>
          <div>
            <span className={styles.username}>{message.username}:</span>
            <span>{formatDate(message.timestamp)}</span>
          </div>
          <p>{message.message}</p>
        </div>
      ))}
    </div>
  );
}
