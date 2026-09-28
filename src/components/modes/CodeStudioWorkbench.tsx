import React, { useState } from 'react';
import { CodeArtifactData } from '../../types';
import {
  Code,
  Copy,
  Check,
  Download,
  Play,
  Terminal,
  FileCode,
  Sparkles,
} from 'lucide-react';

interface CodeStudioWorkbenchProps {
  data: CodeArtifactData;
  prompt: string;
}

export const CodeStudioWorkbench: React.FC<CodeStudioWorkbenchProps> = ({ data, prompt }) => {
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);

  const activeFile = data.files[activeFileIdx] || data.files[0];

  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Code Studio &amp; Sandbox
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {data.files.length} Source Files
              </span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{data.title}</h3>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Tests...' : 'Run Test Suite'}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy File'}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* File Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {data.files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFileIdx(idx)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono font-medium border-b-2 transition ${
                  activeFileIdx === idx
                    ? 'border-emerald-400 text-emerald-300 bg-slate-950/70'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.fileName}</span>
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-500 px-3 hidden sm:inline">
            {activeFile?.language.toUpperCase()}
          </span>
        </div>

        {/* Code Content View */}
        <div className="p-4 sm:p-5 overflow-x-auto max-h-[460px] scrollbar-thin scrollbar-thumb-slate-800 font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
          <pre className="table">
            {activeFile?.code.split('\n').map((line, lIdx) => (
              <div key={lIdx} className="table-row hover:bg-slate-900/50">
                <span className="table-cell pr-4 select-none text-slate-600 text-right text-[11px]">
                  {lIdx + 1}
                </span>
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Terminal / Test Output Drawer */}
        {showTerminal && data.terminalOutput && (
          <div className="border-t border-slate-800 bg-black/80 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800/80">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold uppercase">
                <Terminal className="w-3.5 h-3.5" />
                <span>Execution Sandbox &amp; Test Telemetry</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Exit Code 0 (Success)</span>
            </div>
            <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
              {data.terminalOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
