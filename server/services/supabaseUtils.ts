import { Socket } from 'socket.io';
import { ChatMessage } from '../index';
import supabase from '../services/supabase';

export async function saveSupabaseMessage(
  msg: ChatMessage,
  socket: Socket
): Promise<void> {
  const { error } = await supabase.from('chat_messages').insert(msg);

  if (error) {
    console.error('Error inserting message:', error);
    socket.emit('errorMessage', 'Failed to send message.');
  }
}

export async function getSupabaseMessage(room: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select()
    .eq('room', room)
    .order('timestamp', { ascending: true })
    .returns<ChatMessage[]>();

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  if (data === null) return [];

  return data;
}
