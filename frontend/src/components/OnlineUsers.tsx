import React from 'react';
import { useChat } from '../context/ChatContext';
import { Users, LogOut } from 'lucide-react';

export const OnlineUsers: React.FC = () => {
  const { onlineUsers, currentUser, logout } = useChat();

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-64 flex-shrink-0">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          Online ({onlineUsers.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {onlineUsers.map((user, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-800/60">
            <div className="relative">
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                alt={user.username}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div className="truncate">
              <div className="text-sm font-medium text-slate-200 truncate">
                {user.username} {user.username === currentUser?.username && '(You)'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentUser && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.username}
              className="w-7 h-7 rounded-lg border border-slate-700"
            />
            <span className="text-xs font-semibold text-slate-300 truncate">{currentUser.username}</span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
