import React, { useState } from 'react';
import { CompareArtifactData } from '../../types';
import { GitCompare, Download, Check, Copy, Award } from 'lucide-react';

interface CompareMatrixViewProps {
  data: CompareArtifactData;
  prompt: string;
}

export const CompareMatrixView: React.FC<CompareMatrixViewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleExportCsv = () => {
    const headers = ['Dimension', data.subjectA, data.subjectB, 'Advantage', 'Analysis'];
    const rows = data.rows.map(r => [
      `"${r.dimension}"`,
      `"${r.optionA.replace(/"/g, '""')}"`,
      `"${r.optionB.replace(/"/g, '""')}"`,
      `"${r.advantage === 'A' ? data.subjectA : r.advantage === 'B' ? data.subjectB : 'Tie'}"`,
      `"${r.analysis.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comparison_${data.subjectA.slice(0, 10)}_vs_${data.subjectB.slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const md = `| Dimension | ${data.subjectA} | ${data.subjectB} | Advantage |\n|---|---|---|---|\n` +
      data.rows.map(r => `| **${r.dimension}** | ${r.optionA} | ${r.optionB} | **${r.advantage === 'A' ? data.subjectA : r.advantage === 'B' ? data.subjectB : 'Tie'}** |`).join('\n');
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Comparative Analysis Matrix
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {data.rows.length} Evaluation Dimensions
              </span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{data.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Table'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">{data.subjectA}</h4>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono">
              Score: {data.scoreA}/100
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Decoupled, scalable across independent teams, optimized for large workloads.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/90 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">{data.subjectB}</h4>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold font-mono">
              Score: {data.scoreB}/100
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Streamlined initial development, low operational overhead, rapid prototyping.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-4 w-1/5">Dimension</th>
                <th className="p-4 w-1/3 text-cyan-300">{data.subjectA}</th>
                <th className="p-4 w-1/3 text-blue-300">{data.subjectB}</th>
                <th className="p-4 text-center">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition">
                  <td className="p-4 font-bold text-white text-xs align-top">
                    {row.dimension}
                  </td>
                  <td className="p-4 text-slate-300 text-xs leading-relaxed align-top">
                    {row.optionA}
                  </td>
                  <td className="p-4 text-slate-300 text-xs leading-relaxed align-top">
                    {row.optionB}
                  </td>
                  <td className="p-4 text-center align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        row.advantage === 'A'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : row.advantage === 'B'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      {row.advantage === 'A' ? data.subjectA.split(' ')[0] : row.advantage === 'B' ? data.subjectB.split(' ')[0] : 'Tie'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Recommendation */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 space-y-2">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Strategic Decision Recommendation</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {data.recommendation}
        </p>
      </div>
    </div>
  );
};
