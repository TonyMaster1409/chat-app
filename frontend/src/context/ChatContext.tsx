import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatRoom, MessageType, User } from '../types/chat';
import { api } from '../services/api';
import { webSocketService } from '../services/websocket';

interface ChatContextType {
  currentUser: User | null;
  activeRoom: ChatRoom | null;
  rooms: ChatRoom[];
  messages: ChatMessage[];
  onlineUsers: User[];
  typingUsers: string[];
  isConnected: boolean;
  login: (username: string, avatarUrl: string) => Promise<void>;
  logout: () => void;
  selectRoom: (room: ChatRoom) => void;
  createNewRoom: (name: string, description: string) => Promise<void>;
  sendMessage: (content: string) => void;
  sendTyping: () => void;
  refreshRooms: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('chat_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Load available rooms
  const loadRooms = useCallback(async () => {
    try {
      const roomList = await api.getRooms();
      setRooms(roomList);
      if (roomList.length > 0 && !activeRoom) {
        setActiveRoom(roomList[0]);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    }
  }, [activeRoom]);

  // Load online users
  const loadOnlineUsers = useCallback(async () => {
    try {
      const users = await api.getOnlineUsers();
      setOnlineUsers(users);
    } catch (err) {
      console.error('Failed to load online users:', err);
    }
  }, []);

  useEffect(() => {
    loadRooms();
    loadOnlineUsers();
  }, []);

  // Connect WebSocket when currentUser changes
  useEffect(() => {
    if (!currentUser) return;

    webSocketService.connect(
      () => {
        setIsConnected(true);
        loadOnlineUsers();
      },
      (err) => {
        setIsConnected(false);
        console.error('WebSocket connection error:', err);
      }
    );

    return () => {
      // webSocketService.disconnect();
    };
  }, [currentUser, loadOnlineUsers]);

  // Handle incoming WebSocket messages for active room
  const handleIncomingMessage = useCallback((msg: ChatMessage) => {
    if (msg.type === MessageType.TYPING) {
      if (msg.sender !== currentUser?.username) {
        setTypingUsers((prev) => {
          if (!prev.includes(msg.sender)) {
            return [...prev, msg.sender];
          }
          return prev;
        });
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== msg.sender));
        }, 3000);
      }
      return;
    }

    setMessages((prev) => [...prev, msg]);

    if (msg.type === MessageType.JOIN || msg.type === MessageType.LEAVE) {
      loadOnlineUsers();
    }
  }, [currentUser, loadOnlineUsers]);

  // Subscribe to room topic when active room changes
  useEffect(() => {
    if (!activeRoom || !currentUser || !isConnected) return;

    // Load message history from REST API
    api.getRoomHistory(activeRoom.roomId).then((history) => {
      setMessages(history);
    }).catch(console.error);

    // Subscribe to STOMP destination
    webSocketService.subscribeToRoom(activeRoom.roomId, handleIncomingMessage);

    // Send JOIN notification
    webSocketService.joinRoom(activeRoom.roomId, {
      type: MessageType.JOIN,
      content: `${currentUser.username} joined the chat.`,
      sender: currentUser.username,
      senderAvatar: currentUser.avatarUrl,
      roomId: activeRoom.roomId,
    });
  }, [activeRoom, currentUser, isConnected, handleIncomingMessage]);

  const login = async (username: string, avatarUrl: string) => {
    const user = await api.loginUser(username, avatarUrl);
    setCurrentUser(user);
    localStorage.setItem('chat_user', JSON.stringify(user));
  };

  const logout = () => {
    if (currentUser) {
      api.logoutUser(currentUser.username).catch(console.error);
    }
    localStorage.removeItem('chat_user');
    setCurrentUser(null);
    webSocketService.disconnect();
    setIsConnected(false);
  };

  const selectRoom = (room: ChatRoom) => {
    setActiveRoom(room);
    setTypingUsers([]);
  };

  const createNewRoom = async (name: string, description: string) => {
    const newRoom = await api.createRoom(name, description);
    setRooms((prev) => [...prev, newRoom]);
    setActiveRoom(newRoom);
  };

  const sendMessage = (content: string) => {
    if (!currentUser || !activeRoom) return;

    const chatMsg: ChatMessage = {
      type: MessageType.CHAT,
      content,
      sender: currentUser.username,
      senderAvatar: currentUser.avatarUrl,
      roomId: activeRoom.roomId,
    };

    webSocketService.sendMessage(activeRoom.roomId, chatMsg);
  };

  const sendTyping = () => {
    if (!currentUser || !activeRoom) return;

    const typingMsg: ChatMessage = {
      type: MessageType.TYPING,
      content: 'typing...',
      sender: currentUser.username,
      senderAvatar: currentUser.avatarUrl,
      roomId: activeRoom.roomId,
    };

    webSocketService.sendTypingStatus(activeRoom.roomId, typingMsg);
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        activeRoom,
        rooms,
        messages,
        onlineUsers,
        typingUsers,
        isConnected,
        login,
        logout,
        selectRoom,
        createNewRoom,
        sendMessage,
        sendTyping,
        refreshRooms: loadRooms,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
