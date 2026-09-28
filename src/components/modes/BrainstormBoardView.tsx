import React, { useState } from 'react';
import { BrainstormArtifactData, BrainstormIdea } from '../../types';
import { Lightbulb, ThumbsUp, Plus, Download, Tag, Check, Sparkles } from 'lucide-react';

interface BrainstormBoardViewProps {
  data: BrainstormArtifactData;
  prompt: string;
}

export const BrainstormBoardView: React.FC<BrainstormBoardViewProps> = ({ data: initialData }) => {
  const [ideas, setIdeas] = useState<BrainstormIdea[]>(initialData.ideas);
  const [activeFilter, setActiveFilter] = useState<'all' | 'moonshot' | 'quick_win' | 'high_impact' | 'foundation'>('all');
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleVote = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea))
    );
  };

  const handleAddIdea = () => {
    if (!newIdeaTitle.trim()) return;
    const newIdea: BrainstormIdea = {
      id: `custom-${Date.now()}`,
      title: newIdeaTitle.trim(),
      description: newIdeaDesc.trim() || 'Custom strategy formulated during brainstorming session.',
      category: activeFilter === 'all' ? 'high_impact' : activeFilter,
      votes: 1,
      tags: ['Custom', 'User Submitted'],
    };
    setIdeas([newIdea, ...ideas]);
    setNewIdeaTitle('');
    setNewIdeaDesc('');
    setShowAddModal(false);
  };

  const filteredIdeas = activeFilter === 'all'
    ? ideas
    : ideas.filter((i) => i.category === activeFilter);

  const categoryMeta = {
    moonshot: { label: 'Moonshots 🚀', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
    quick_win: { label: 'Quick Wins ⚡', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
    high_impact: { label: 'High Impact 💡', color: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
    foundation: { label: 'Foundation 🛡️', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Brainstorming Idea Board
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">{ideas.length} Strategic Ideas</span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{initialData.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Idea</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {(['all', 'moonshot', 'quick_win', 'high_impact', 'foundation'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              activeFilter === cat
                ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Ideas' : categoryMeta[cat].label}
          </button>
        ))}
      </div>

      {/* Idea Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map((idea) => {
          const meta = categoryMeta[idea.category];
          return (
            <div
              key={idea.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${meta.color}`}>
                    {meta.label}
                  </span>
                  <button
                    onClick={() => handleVote(idea.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-800 transition active:scale-95"
                    title="Upvote idea"
                  >
                    <ThumbsUp className="w-3 h-3 text-amber-400" />
                    <span>{idea.votes}</span>
                  </button>
                </div>

                <h4 className="font-bold text-sm text-white leading-snug group-hover:text-amber-200 transition">
                  {idea.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {idea.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {idea.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Add Brainstorm Idea</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Title:</label>
                <input
                  type="text"
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  placeholder="e.g. Distributed Invariant Validator"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Description:</label>
                <textarea
                  value={newIdeaDesc}
                  onChange={(e) => setNewIdeaDesc(e.target.value)}
                  placeholder="Explain the mechanism and tactical benefits..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIdea}
                disabled={!newIdeaTitle.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs rounded-lg shadow-md disabled:opacity-50"
              >
                Save Idea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
