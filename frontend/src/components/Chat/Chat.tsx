import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import styles from './Chat.module.css';

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

  useEffect(() => {
    socket.on('receiveMessage', (message: ChatMessage): void => {
      setMessages((prevMessages: ChatMessage[]): ChatMessage[] => [
        ...prevMessages,
        message,
      ]);
    });

    socket.on('chatHistory', (messages: ChatMessage[]): void => {
      setMessages(messages);
    });

    // clean up listener when component unmounts to prevent memory leaks
    return (): void => {
      socket.off(`receiveMessage`);
      socket.off('chatHistory');
    };
  }, [socket]);

  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  function sendMessage() {
    if (message !== '') {
      const timestamp = new Date().toISOString();
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
          placeholder="Message here..."
          onChange={(e) => setMessage(e.target.value)}
          value={message} // controlled by react state so it can be reset after sending message
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
