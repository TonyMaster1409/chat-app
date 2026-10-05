import React from 'react';
import { useChat } from '../context/ChatContext';

export const TypingIndicator: React.FC = () => {
  const { typingUsers } = useChat();

  if (typingUsers.length === 0) return null;

  return (
    <div className="px-4 py-1.5 text-xs text-slate-400 flex items-center gap-2 animate-pulse bg-slate-900/30 border-t border-slate-800/50">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
      </div>
      <span>
        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
      </span>
    </div>
  );
};
