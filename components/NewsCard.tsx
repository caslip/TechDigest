import React, { useEffect, useState, useCallback } from 'react';
import { generateTopicSummary } from '../services/geminiService';
import { NewsItem } from '../types';
import { RefreshCw, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

interface NewsCardProps {
  topic: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ topic }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    // If we have data and it's less than 1 hour old, don't auto-refresh unless explicitly requested
    if (!isRefresh && lastUpdated && (new Date().getTime() - lastUpdated.getTime() < 3600000)) {
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateTopicSummary(topic);
      setNews(result.news);
      setSources(result.sources);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, lastUpdated]);

  useEffect(() => {
    // Initial fetch
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 w-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
        <h3 className="text-xl font-bold text-slate-800 truncate pr-4" title={topic}>{topic}</h3>
        <div className="flex items-center gap-3">
            {/* Timestamp for larger screens */}
            {!loading && !error && lastUpdated && (
                <span className="text-xs text-slate-400 hidden sm:inline-block">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            )}
            <button
            onClick={() => fetchData(true)}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh Summary"
            >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="text-sm font-medium animate-pulse">Consulting Gemini...</p>
          </div>
        ) : error ? (
          <div className="py-8 flex flex-col items-center justify-center text-rose-500 gap-2 text-center">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => fetchData(true)}
              className="mt-2 text-xs bg-rose-50 px-3 py-1 rounded-full hover:bg-rose-100 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item, idx) => (
              <div key={idx} className="flex flex-col h-full group md:border-r md:border-slate-100 md:last:border-r-0 md:pr-8 md:last:pr-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getImpactColor(item.impact)} whitespace-nowrap uppercase tracking-wide`}>
                    {item.impact}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                  {item.headline}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed flex-grow">
                  {item.summary}
                </p>
              </div>
            ))}
            
            {news.length === 0 && (
                <div className="col-span-3 text-center text-slate-400 py-10">
                    <p>No significant news found in the last 7 days.</p>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Resources - Prominently displayed */}
      {!loading && !error && sources.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-start gap-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1.5 min-w-[80px]">Resources</p>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-md transition-all shadow-sm max-w-[240px]"
                title={source.title}
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
                <span className="truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;