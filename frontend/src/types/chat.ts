export enum MessageType {
  CHAT = 'CHAT',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  TYPING = 'TYPING'
}

export interface ChatMessage {
  id?: number;
  type: MessageType;
  content: string;
  sender: string;
  senderAvatar?: string;
  roomId: string;
  timestamp?: string;
}

export interface ChatRoom {
  id: number;
  roomId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface User {
  id?: number;
  username: string;
  avatarUrl: string;
  online: boolean;
}
