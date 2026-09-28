import React, { useState } from 'react';
import {
  FolderKanban,
  Folder,
  FileText,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Bookmark,
  Share2,
} from 'lucide-react';

interface KnowledgeWorkspaceViewProps {
  onLoadSessionPrompt: (prompt: string) => void;
}

export const KnowledgeWorkspaceView: React.FC<KnowledgeWorkspaceViewProps> = ({
  onLoadSessionPrompt,
}) => {
  const [activeFolder, setActiveFolder] = useState('research');

  const folders = [
    { id: 'projects', name: 'Projects', count: 3 },
    { id: 'research', name: 'Research Sessions', count: 5 },
    { id: 'presentations', name: 'Presentations & Decks', count: 2 },
    { id: 'documents', name: 'Documents & Briefs', count: 4 },
    { id: 'code', name: 'Code & Architecture', count: 2 },
    { id: 'design', name: 'Design & Figma', count: 1 },
    { id: 'saved', name: 'Saved Answers', count: 6 },
  ];

  const savedItems = [
    {
      id: 'item-1',
      title: 'India EV Battery Supply Chain & PLI Briefing',
      date: 'Today, 10:45 AM',
      models: ['Gemini', 'OpenAI', 'Claude', 'Perplexity'],
      tokens: 2840,
      summary: 'Executive synthesis on LFP cell localized gigafactories, AIS-156 Phase 2 standards, and battery telematics venture bets.',
      prompt: 'Research the latest developments in electric vehicles in India and prepare a concise business briefing.',
    },
    {
      id: 'item-2',
      title: 'Distributed Payment Gateway Resiliency Audit',
      date: 'Yesterday, 4:12 PM',
      models: ['Claude', 'OpenAI', 'Gemini'],
      tokens: 4120,
      summary: 'Kafka vs. Google Pub/Sub latency under 50k RPS, disaster recovery partition tolerance, and dead-letter queues.',
      prompt: 'Analyze high-throughput event processing pipelines for payment gateways. Compare Kafka vs. RabbitMQ vs. Google Cloud Pub/Sub.',
    },
    {
      id: 'item-3',
      title: 'WCAG 2.2 Telematics HUD Design System Audit',
      date: 'Sep 21, 2:30 PM',
      models: ['Figma', 'Gemini', 'Claude'],
      tokens: 1980,
      summary: 'Contrast failure on secondary telemetry status (AA passed, AAA failed); added icon glyph recommendation.',
      prompt: 'Audit mobile navigation patterns and dark-mode color tokens for accessibility compliance.',
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
          <FolderKanban className="w-4 h-4" />
          <span>Knowledge Repository &amp; Workspaces</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          My Workspace
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Browse organized research dossiers, multi-model sessions, prompt archives, and exported presentation decks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folders List */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            Workspace Folders
          </span>
          <div className="space-y-1">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition ${
                  activeFolder === f.id
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className="w-4 h-4" />
                  <span>{f.name}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20">
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Folder Contents */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Saved Sessions ({savedItems.length})
            </span>
          </div>

          <div className="space-y-3">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-bold text-white text-sm hover:text-sky-300 transition cursor-pointer">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {item.summary}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-1.5">
                    {item.models.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLoadSessionPrompt(item.prompt)}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition"
                    >
                      Re-run Prompt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
