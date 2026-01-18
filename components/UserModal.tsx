import React, { useState, useEffect, useRef } from 'react';
import { UserPreferences } from '../types';
import { X, Plus, Trash2, User, List, Check, Camera, Sparkles, CreditCard, Briefcase, Database, Key, Globe } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
}

type Tab = 'profile' | 'subscriptions' | 'config';

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, preferences, onSave }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [name, setName] = useState(preferences.name);
  const [jobTitle, setJobTitle] = useState(preferences.jobTitle || '');
  const [avatar, setAvatar] = useState<string | undefined>(preferences.avatar);
  const [topics, setTopics] = useState<string[]>(preferences.topics);
  const [newTopic, setNewTopic] = useState('');
  
  // Config fields
  const [customModelName, setCustomModelName] = useState(preferences.customModelName || '');
  const [baseUrl, setBaseUrl] = useState(preferences.baseUrl || '');
  const [serpApiKey, setSerpApiKey] = useState(preferences.serpApiKey || '');
  const [openAiApiKey, setOpenAiApiKey] = useState(preferences.openAiApiKey || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(preferences.name);
      setJobTitle(preferences.jobTitle || '');
      setAvatar(preferences.avatar);
      setTopics(preferences.topics);
      setCustomModelName(preferences.customModelName || '');
      setBaseUrl(preferences.baseUrl || '');
      setSerpApiKey(preferences.serpApiKey || '');
      setOpenAiApiKey(preferences.openAiApiKey || '');
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
    onSave({ 
      ...preferences, 
      name, 
      jobTitle,
      avatar,
      topics,
      customModelName,
      baseUrl,
      serpApiKey,
      openAiApiKey
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert("Image size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Account Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'profile' 
                ? 'text-indigo-600 bg-indigo-50/50' 
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
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'subscriptions' 
                ? 'text-indigo-600 bg-indigo-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <List className="w-4 h-4" />
              Topics
            </div>
            {activeTab === 'subscriptions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'config' 
                ? 'text-indigo-600 bg-indigo-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Database className="w-4 h-4" />
              API & Model
            </div>
            {activeTab === 'config' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'profile' ? (
            <div className="space-y-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-md">
                    {avatar ? (
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-3xl">
                        {name ? name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800">{name || 'User'}</h3>
                  <p className="text-slate-500 text-sm mb-3">{jobTitle || 'Tech Enthusiast'}</p>
                  <div className="flex gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors"
                    >
                        Change Avatar
                    </button>
                    {avatar && (
                        <button 
                            onClick={() => setAvatar(undefined)}
                            className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-md font-medium hover:bg-slate-50 transition-colors"
                        >
                            Remove
                        </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Title / Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>
                </div>
              </div>

              {/* Plan Section */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-indigo-600" />
                            Current Plan
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">You are currently on the <span className="font-bold text-slate-700">Free Tier</span></p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Active</span>
                </div>
                
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Daily Summaries</span>
                        <span className="font-medium">Unlimited</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Topics</span>
                        <span className="font-medium">{topics.length} / 5</span>
                    </div>
                </div>

                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Upgrade to Pro
                </button>
              </div>
            </div>
          ) : activeTab === 'subscriptions' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Add New Topic</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    placeholder="e.g. Generative AI"
                  />
                  <button
                    onClick={handleAddTopic}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex justify-between">
                  <span>Your Subscriptions</span>
                  <span>{topics.length} / 5</span>
                </h3>
                <div className="space-y-2">
                  {topics.map(topic => (
                    <div key={topic} className="flex items-center justify-between bg-white border border-slate-200 px-4 py-3 rounded-lg group hover:border-indigo-300 hover:shadow-sm transition-all">
                      <span className="text-slate-700 font-medium">{topic}</span>
                      <button
                        onClick={() => handleRemoveTopic(topic)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {topics.length === 0 && (
                    <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <p className="text-slate-400 text-sm">No topics subscribed yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-4">
                 <p className="text-sm text-indigo-800">
                   Configure your AI model preferences and external API keys here.
                 </p>
               </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Model Name</label>
                <div className="relative">
                  <Database className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    placeholder="gemini-3-flash-preview"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Leave empty to use the default optimized model.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Base URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    placeholder="https://generativelanguage.googleapis.com"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Optional. Override the default API endpoint.</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">External Keys</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">SerpApi Key</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={serpApiKey}
                        onChange={(e) => setSerpApiKey(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="sk-..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">OpenAI API Key</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        value={openAiApiKey}
                        onChange={(e) => setOpenAiApiKey(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        placeholder="sk-..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md shadow-indigo-200 transition-all font-medium text-sm flex items-center gap-2"
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