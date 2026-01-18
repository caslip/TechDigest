import React, { useEffect, useState, useCallback } from 'react';
import { generateTopicSummary } from '../services/geminiService';
import { NewsItem } from '../types';
import { RefreshCw, ExternalLink, AlertCircle, Loader2, Calendar, ArrowRight, Globe } from 'lucide-react';

interface NewsCardProps {
  topic: string;
  modelName?: string;
  baseUrl?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ topic, modelName, baseUrl }) => {
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
      const result = await generateTopicSummary(topic, modelName, baseUrl);
      setNews(result.news);
      setSources(result.sources);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, lastUpdated, modelName, baseUrl]);

  useEffect(() => {
    // Initial fetch
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, modelName, baseUrl]); // Re-fetch if model or baseUrl changes

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 w-full mb-8">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-slate-800 truncate" title={topic}>{topic}</h3>
        </div>
        <div className="flex items-center gap-3">
            {/* Timestamp for larger screens */}
            {!loading && !error && lastUpdated && (
                <span className="text-xs text-slate-400 hidden sm:inline-block font-medium">
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
      <div className="p-6 bg-slate-50/50">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
            <p className="text-sm font-medium animate-pulse text-indigo-900/40">Analyzing recent events...</p>
          </div>
        ) : error ? (
          <div className="py-12 flex flex-col items-center justify-center text-rose-500 gap-3 text-center">
            <div className="p-3 bg-rose-50 rounded-full">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">{error}</p>
            <button 
              onClick={() => fetchData(true)}
              className="mt-2 text-xs bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <div key={idx} className="flex flex-col h-full bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getImpactColor(item.impact)} uppercase tracking-wider`}>
                    {item.impact}
                  </span>
                  <div className="flex items-center text-slate-400 gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold">{item.date}</span>
                  </div>
                </div>
                
                <h4 className="font-bold text-slate-800 text-base mb-3 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-3">
                  {item.headline}
                </h4>
                
                <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow line-clamp-5">
                  {item.summary}
                </p>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-slate-500 max-w-[60%]">
                      {item.source && (
                        <>
                          <Globe className="w-3 h-3 flex-shrink-0" />
                          <span className="text-[10px] font-semibold uppercase tracking-wide truncate" title={item.source}>{item.source}</span>
                        </>
                      )}
                    </div>
                    
                    {item.url && (
                       <a 
                       href={item.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1 group/link"
                       title={item.url}
                     >
                       Read Story 
                       <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                     </a>
                    )}
                </div>
              </div>
            ))}
            
            {news.length === 0 && (
                <div className="col-span-3 text-center text-slate-400 py-12 bg-white rounded-xl border border-dashed border-slate-200">
                    <p className="text-sm">No significant developments found in the last 7 days.</p>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Resources - Subtle display */}
      {!loading && !error && sources.length > 0 && (
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center gap-4 text-xs">
          <span className="font-semibold text-slate-400">Also Referenced:</span>
          <div className="flex gap-4 overflow-x-auto no-scrollbar mask-linear-fade">
            {sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors whitespace-nowrap"
                title={source.title}
              >
                <ExternalLink className="w-3 h-3" />
                <span className="font-medium hover:underline">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;