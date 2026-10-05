import React from 'react';
import { useChat } from './context/ChatContext';
import { UserLogin } from './components/UserLogin';
import { RoomList } from './components/RoomList';
import { ChatRoom } from './components/ChatRoom';
import { OnlineUsers } from './components/OnlineUsers';

const MainLayout: React.FC = () => {
  const { currentUser } = useChat();

  if (!currentUser) {
    return <UserLogin />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      <RoomList />
      <ChatRoom />
      <OnlineUsers />
    </div>
  );
};

export function App() {
  return <MainLayout />;
}

export default App;
