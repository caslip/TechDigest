import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UserModal from './components/UserModal';
import NewsCard from './components/NewsCard';
import { getUserPreferences, saveUserPreferences } from './services/storageService';
import { UserPreferences } from './types';
import { PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserPreferences>({ name: '', topics: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load data from local storage on mount
    const prefs = getUserPreferences();
    setUser(prefs);
    setIsLoaded(true);
  }, []);

  const handleSaveUser = (newPrefs: UserPreferences) => {
    setUser(newPrefs);
    saveUserPreferences(newPrefs);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onOpenProfile={() => setIsModalOpen(true)} />
      
      {/* Changed max-width to 5xl for better readability of horizontal cards */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Tech Digest</h2>
          <p className="text-slate-500 text-lg">
            AI-curated summaries for <span className="text-indigo-600 font-semibold">{user.topics.length}</span> technology topics you follow.
          </p>
        </div>

        {user.topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <PlusCircle className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No topics subscribed</h3>
            <p className="text-slate-500 mb-6 max-w-md text-center">
              Start by adding technology topics you are interested in (e.g., "Generative AI", "Web Assembly", "SpaceX").
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all font-medium"
            >
              Add Your First Topic
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {user.topics.map((topic) => (
              <NewsCard key={topic} topic={topic} modelName={user.customModelName} baseUrl={user.baseUrl} />
            ))}
            
            {/* Add New Topic Button - Full Width */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
            >
               <div className="flex items-center gap-2">
                <PlusCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg">Add Another Topic</span>
              </div>
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} TechDigest.ai. Powered by Google Gemini.</p>
        </div>
      </footer>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preferences={user}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default App;