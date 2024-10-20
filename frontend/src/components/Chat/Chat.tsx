import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import styles from './chat.module.css';

interface ChatMessage {
  username: string;
  message: string;
  room: string;
  timestamp: Date;
}

interface ChatProps {
  socket: Socket;
  username: string;
  room: string;
}

export default function Chat({ socket, username, room }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    socket.on('receiveMessage', (message: ChatMessage): void => {
      setMessages((prevMessages: ChatMessage[]): ChatMessage[] => [
        ...prevMessages,
        message,
      ]);
    });

    // clean up listener when component unmounts to prevent memory leaks
    return (): void => {
      socket.off('receiveMessage');
    };
  }, [socket]);

  function formatDate(timestamp: Date): string {
    return timestamp.toLocaleString();
  }

  function sendMessage() {
    if (message !== '') {
      const timestamp = Date.now();
      socket.emit('sendMessage', { username, room, message, timestamp });
      setMessage('');
    }
  }

  return (
    <div>
      {/* message container */}
      <div className={styles.messageContainer}>
        {messages.map((msg: ChatMessage, index: number) => (
          <div key={index} className={styles.message}>
            <div>
              <span className={styles.username}>{msg.username}:</span>
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
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="button"
          className="sendMessageButton"
          onClick={sendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
