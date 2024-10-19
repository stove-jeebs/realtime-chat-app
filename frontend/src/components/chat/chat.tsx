import { Socket } from 'socket.io-client';
import styles from './chat.module.css';

import Messages from './messages';

export default function Chat({ socket }: { socket: Socket }) {
  return (
    <div className={styles.messagesContainer}>
      <Messages socket={socket} />
    </div>
  );
}
