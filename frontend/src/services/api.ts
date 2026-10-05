import axios from 'axios';
import { ChatMessage, ChatRoom, User } from '../types/chat';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Rooms
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await axios.get<ChatRoom[]>(`${API_BASE_URL}/rooms`);
    return response.data;
  },

  createRoom: async (name: string, description: string): Promise<ChatRoom> => {
    const response = await axios.post<ChatRoom>(`${API_BASE_URL}/rooms`, { name, description });
    return response.data;
  },

  getRoomHistory: async (roomId: string): Promise<ChatMessage[]> => {
    const response = await axios.get<ChatMessage[]>(`${API_BASE_URL}/rooms/${roomId}/history`);
    return response.data;
  },

  // Users
  loginUser: async (username: string, avatarUrl: string): Promise<User> => {
    const response = await axios.post<User>(`${API_BASE_URL}/users/login`, { username, avatarUrl });
    return response.data;
  },

  getOnlineUsers: async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_BASE_URL}/users/online`);
    return response.data;
  },

  logoutUser: async (username: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/users/logout`, null, { params: { username } });
  }
};
