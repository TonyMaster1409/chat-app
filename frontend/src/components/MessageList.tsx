import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { MessageType } from '../types/chat';

export const MessageList: React.FC = () => {
  const { messages, currentUser } = useChat();
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-2">
            💬
          </div>
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((msg, index) => {
          if (msg.type === MessageType.JOIN || msg.type === MessageType.LEAVE) {
            return (
              <div key={index} className="flex justify-center my-2">
                <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          const isSelf = msg.sender === currentUser?.username;

          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <img
                src={msg.senderAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.sender}`}
                alt={msg.sender}
                className="w-9 h-9 rounded-xl border border-slate-800 bg-slate-900 flex-shrink-0"
              />
              <div
                className={`max-w-[70%] flex flex-col ${
                  isSelf ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-400">{msg.sender}</span>
                  <span className="text-[10px] text-slate-600">{formatTime(msg.timestamp)}</span>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isSelf
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-600/10'
                      : 'bg-slate-800/80 text-slate-100 rounded-tl-xs border border-slate-700/50'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={endRef} />
    </div>
  );
};
