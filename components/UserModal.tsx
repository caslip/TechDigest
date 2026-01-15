import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { X, Plus, Trash2, User, List, Check } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
}

type Tab = 'profile' | 'subscriptions';

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, preferences, onSave }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [name, setName] = useState(preferences.name);
  const [topics, setTopics] = useState<string[]>(preferences.topics);
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(preferences.name);
      setTopics(preferences.topics);
      setActiveTab('profile');
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'profile' 
                ? 'text-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </div>
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'subscriptions' 
                ? 'text-indigo-600' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <List className="w-4 h-4" />
              Subscriptions
            </div>
            {activeTab === 'subscriptions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center gap-4 py-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-200">
                  {name ? name.charAt(0).toUpperCase() : '?'}
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Preview</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  placeholder="Enter your name"
                />
                <p className="text-xs text-slate-400 mt-2">
                  This name will be displayed in your daily digest greeting.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Add New Topic</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    placeholder="e.g. Generative AI"
                  />
                  <button
                    onClick={handleAddTopic}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Your Subscriptions ({topics.length})
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {topics.map(topic => (
                    <div key={topic} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-3 rounded-lg group hover:border-indigo-200 transition-colors">
                      <span className="text-slate-700 font-medium">{topic}</span>
                      <button
                        onClick={() => handleRemoveTopic(topic)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {topics.length === 0 && (
                    <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-slate-400 text-sm">No topics subscribed yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md shadow-indigo-200 transition-all font-medium text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;