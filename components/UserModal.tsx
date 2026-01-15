import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { X, Plus, Trash2, User } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, preferences, onSave }) => {
  const [name, setName] = useState(preferences.name);
  const [topics, setTopics] = useState<string[]>(preferences.topics);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(preferences.name);
      setTopics(preferences.topics);
    }
  }, [isOpen, preferences]);

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(topics.filter(t => t !== topicToRemove));
  };

  const handleSave = () => {
    onSave({ ...preferences, name, topics });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            User Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          {/* Topics Management */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subscribed Topics</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="Add a technology..."
              />
              <button
                onClick={handleAddTopic}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {topics.map(topic => (
                <div key={topic} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg group">
                  <span className="text-slate-700 font-medium">{topic}</span>
                  <button
                    onClick={() => handleRemoveTopic(topic)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {topics.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-2">No topics subscribed yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md shadow-indigo-200 transition-all font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;