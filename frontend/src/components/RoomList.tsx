import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Hash, Plus, X } from 'lucide-react';

export const RoomList: React.FC = () => {
  const { rooms, activeRoom, selectRoom, createNewRoom } = useChat();
  const [showModal, setShowModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      await createNewRoom(newRoomName.trim(), newRoomDesc.trim());
      setNewRoomName('');
      setNewRoomDesc('');
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-64 flex-shrink-0">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Channels ({rooms.length})
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Create Channel"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {rooms.map((room) => {
          const isActive = activeRoom?.roomId === room.roomId;
          return (
            <button
              key={room.id}
              onClick={() => selectRoom(room)}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                isActive
                  ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Hash className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <div className="truncate">
                <div className="text-sm truncate">{room.name}</div>
                {room.description && (
                  <div className="text-xs text-slate-500 truncate">{room.description}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal for creating channel */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Create New Channel</h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. dev-team"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="What is this channel about?"
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 text-sm text-white outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                Create Channel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
