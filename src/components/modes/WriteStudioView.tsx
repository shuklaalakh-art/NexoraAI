import React, { useState } from 'react';
import { WriteArtifactData } from '../../types';
import { PenTool, Download, Copy, Check, Clock, BookOpen } from 'lucide-react';
import { MarkdownViewer } from '../common/MarkdownViewer';

interface WriteStudioViewProps {
  data: WriteArtifactData;
  prompt: string;
}

export const WriteStudioView: React.FC<WriteStudioViewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([data.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.slice(0, 20)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/20 shrink-0">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Editorial Document Studio
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {data.wordCount} Words • {data.readingTime}
              </span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{data.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Article'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Document</span>
          </button>
        </div>
      </div>

      {/* Formatted Article Canvas */}
      <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl max-w-4xl mx-auto space-y-6">
        <div className="space-y-2 pb-6 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {data.subtitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <span>By {data.author}</span>
            <span>•</span>
            <span>{data.date}</span>
            <span>•</span>
            <span>{data.readingTime}</span>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-sm">
          <MarkdownViewer content={data.content} />
        </div>
      </div>
    </div>
  );
};
