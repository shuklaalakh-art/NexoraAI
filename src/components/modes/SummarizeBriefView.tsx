import React, { useState, useEffect } from 'react';
import { SummarizeArtifactData } from '../../types';
import { FileText, Volume2, VolumeX, Play, Pause, Copy, Check, Download, Clock } from 'lucide-react';

interface SummarizeBriefViewProps {
  data: SummarizeArtifactData;
  prompt: string;
}

export const SummarizeBriefView: React.FC<SummarizeBriefViewProps> = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [copied, setCopied] = useState(false);

  // Web Speech API Voice synthesis
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data.audioScript);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleCopy = () => {
    const text = `# ${data.title}\n\n### 30-Second Elevator Pitch\n${data.thirtySecPitch}\n\n### Core Invariants & Takeaways\n` +
      data.bulletTakeaways.map((b) => `- ${b}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = `# ${data.title}\n\n### 30-Second Elevator Pitch\n${data.thirtySecPitch}\n\n### Core Invariants & Takeaways\n` +
      data.bulletTakeaways.map((b) => `- ${b}`).join('\n');
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `executive_summary.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Executive One-Pager &amp; Audio Brief
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {data.readingTimeMinutes} Min Read
              </span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{data.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Player Controls */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isPlaying
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="Listen to 30-second audio voice summary"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Audio' : 'Listen'}</span>
            </button>

            {/* Speed Selector */}
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="bg-transparent text-[11px] font-mono text-slate-400 outline-none px-1"
            >
              <option value="1.0">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
            </select>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* 30-Second Elevator Pitch Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 space-y-3 relative overflow-hidden">
        {isPlaying && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 animate-pulse" />
        )}
        <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span>30-Second Executive Pitch</span>
          </div>
          {isPlaying && (
            <span className="text-[10px] font-mono text-rose-400 animate-pulse">
              ● Voice Narration Active
            </span>
          )}
        </div>
        <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
          &quot;{data.thirtySecPitch}&quot;
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {data.stats.map((s, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-0.5">
            <span className="text-[10px] uppercase font-mono text-slate-500">{s.label}</span>
            <div className="font-bold text-sm text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Core Invariants / Key Takeaways */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
          Core Takeaways &amp; Execution Invariants
        </h4>
        <div className="space-y-2.5">
          {data.bulletTakeaways.map((b, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {b}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
