import React, { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Smile } from 'lucide-react';

export const MessageInput: React.FC = () => {
  const { sendMessage, sendTyping } = useChat();
  const [text, setText] = useState('');
  const lastTypingTime = useRef<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    // Throttle typing indicator notification
    const now = Date.now();
    if (now - lastTypingTime.current > 2000) {
      sendTyping();
      lastTypingTime.current = now;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Type a message..."
          className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 pl-4 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="button"
          onClick={() => setText((prev) => prev + ' 😊')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Smile className="w-5 h-5" />
        </button>
      </div>
      <button
        type="submit"
        disabled={!text.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white p-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};
