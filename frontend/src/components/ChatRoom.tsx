import React from 'react';
import { useChat } from '../context/ChatContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { Hash, Wifi, WifiOff } from 'lucide-react';

export const ChatRoom: React.FC = () => {
  const { activeRoom, isConnected } = useChat();

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500">
        Select a channel to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100">{activeRoom.name}</h1>
            <p className="text-xs text-slate-400">{activeRoom.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isConnected ? (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <Wifi className="w-3.5 h-3.5" />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
              <WifiOff className="w-3.5 h-3.5" />
              Connecting...
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Typing Indicator */}
      <TypingIndicator />

      {/* Input */}
      <MessageInput />
    </div>
  );
};
