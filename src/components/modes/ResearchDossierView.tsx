import React, { useState } from 'react';
import { ResearchDossierData } from '../../types';
import { Search, Download, Copy, Check, ExternalLink, BookOpen, BarChart3 } from 'lucide-react';

interface ResearchDossierViewProps {
  data: ResearchDossierData;
  prompt: string;
}

export const ResearchDossierView: React.FC<ResearchDossierViewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    const text = `# ${data.title}\n\n### Executive Summary\n${data.executiveSummary}\n\n` +
      `### Key Metrics\n` + data.keyMetrics.map(m => `- ${m.label}: ${m.value} (${m.trend || ''})`).join('\n') +
      `\n\n### Findings\n` + data.findings.map(f => `#### ${f.sectionTitle}\n${f.content}\n*Key Insight: ${f.keyPoint}*`).join('\n\n') +
      `\n\n### Bibliography\n` + data.bibliography.map(b => `- [${b.title}](${b.url}) (${b.domain}, ${b.year})`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDossier = () => {
    const text = `# ${data.title}\n\n### Executive Summary\n${data.executiveSummary}\n\n` +
      `### Key Metrics\n` + data.keyMetrics.map(m => `- ${m.label}: ${m.value} (${m.trend || ''})`).join('\n') +
      `\n\n### Findings\n` + data.findings.map(f => `#### ${f.sectionTitle}\n${f.content}\n*Key Insight: ${f.keyPoint}*`).join('\n\n') +
      `\n\n### Bibliography\n` + data.bibliography.map(b => `- ${b.title} - ${b.url}`).join('\n');
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `research_dossier.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Research Dossier &amp; Whitepaper
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">Grounded Empirical Synthesis</span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{data.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>

          <button
            onClick={handleDownloadDossier}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Dossier</span>
          </button>
        </div>
      </div>

      {/* Abstract Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Executive Abstract &amp; Methodology</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {data.executiveSummary}
        </p>
        <p className="text-[11px] text-slate-400 font-mono pt-1">
          Methodology: {data.methodology}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.keyMetrics.map((m, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              {m.label}
            </span>
            <div className="font-bold text-lg text-white">{m.value}</div>
            <div className="text-[10px] text-emerald-400 flex items-center justify-between pt-1">
              <span>{m.trend}</span>
              <span className="text-slate-500">{m.source}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Core Research Findings */}
      <div className="space-y-3">
        <h4 className="font-bold text-white text-sm uppercase tracking-wider text-[11px] text-slate-400">
          Peer-Reviewed Findings &amp; Technical Analysis
        </h4>
        <div className="space-y-3">
          {data.findings.map((f, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h5 className="font-bold text-sm text-white">{f.sectionTitle}</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{f.content}</p>
              <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-medium">
                💡 Key Finding: {f.keyPoint}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bibliography with verified links */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <span>Grounded Bibliography &amp; Primary Sources</span>
          <span className="text-slate-500">({data.bibliography.length})</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {data.bibliography.map((b, idx) => (
            <a
              key={idx}
              href={b.url}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-sky-500/50 hover:bg-slate-850 text-slate-300 flex items-center justify-between transition group"
            >
              <span className="truncate group-hover:text-sky-300 font-medium mr-2">
                {b.title}
              </span>
              <span className="text-[10px] font-mono text-slate-500 shrink-0 flex items-center gap-1">
                {b.domain} <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
