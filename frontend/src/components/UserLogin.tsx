import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { MessageSquare, Sparkles, User, ArrowRight } from 'lucide-react';

const AVATAR_SELECTIONS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Sam',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Jordan',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Taylor',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Morgan',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Riley',
];

export const UserLogin: React.FC = () => {
  const { login } = useChat();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_SELECTIONS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      await login(username.trim(), selectedAvatar);
    } catch (err) {
      console.error('Failed to log in:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            PulseChat 2024 <Sparkles className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-Time Chat powered by Spring Boot, Redis & PostgreSQL
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_SELECTIONS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-1.5 rounded-xl border transition-all ${
                    selectedAvatar === avatar
                      ? 'border-blue-500 bg-blue-500/10 scale-105 shadow-md shadow-blue-500/20'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-800/40'
                  }`}
                >
                  <img src={avatar} alt="Avatar" className="w-full h-auto rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your handle..."
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
          >
            {loading ? 'Joining Chat...' : 'Join Real-Time Chat'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500 flex justify-center gap-4">
          <span>⚡ WebSocket</span>
          <span>•</span>
          <span>🔴 Redis Pub/Sub</span>
          <span>•</span>
          <span>🐘 PostgreSQL</span>
        </div>
      </div>
    </div>
  );
};
