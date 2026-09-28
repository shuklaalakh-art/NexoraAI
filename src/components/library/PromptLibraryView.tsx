import React, { useState } from 'react';
import { PROMPT_LIBRARY_SEED } from '../../constants/providers';
import { PromptTemplate } from '../../types';
import {
  BookmarkCheck,
  Search,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Plus,
  Tag,
  Trash2,
} from 'lucide-react';

interface PromptLibraryViewProps {
  onSelectPrompt: (promptText: string) => void;
}

export const PromptLibraryView: React.FC<PromptLibraryViewProps> = ({
  onSelectPrompt,
}) => {
  const [prompts, setPrompts] = useState<PromptTemplate[]>(PROMPT_LIBRARY_SEED);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Research',
    'Coding',
    'Presentations',
    'Design',
    'Business',
    'Procurement',
  ];

  const filteredPrompts = prompts.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
          <BookmarkCheck className="w-4 h-4" />
          <span>Curated Templates &amp; Prompt Engineering</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Prompt Library &amp; Orchestration Patterns
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          High-leverage prompt archetypes tailored for multi-model comparison, citations, and strategic synthesis.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompt templates..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-sky-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrompts.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {item.tag}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white group-hover:text-sky-300 transition">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-mono text-[11px]">
                {item.prompt}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(item.prompt, item.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                  title="Copy prompt"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[11px]">
                    {copiedId === item.id ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>

              <button
                onClick={() => onSelectPrompt(item.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-semibold transition"
              >
                <span>Load in Omnibox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
