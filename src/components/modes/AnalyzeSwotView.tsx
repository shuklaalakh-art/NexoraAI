import React from 'react';
import { AnalyzeArtifactData } from '../../types';
import { BarChart2, ShieldCheck, AlertCircle, TrendingUp, Zap } from 'lucide-react';

interface AnalyzeSwotViewProps {
  data: AnalyzeArtifactData;
  prompt: string;
}

export const AnalyzeSwotView: React.FC<AnalyzeSwotViewProps> = ({ data }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Strategic Analytics &amp; SWOT Matrix
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">Quantitative &amp; Strategic Audit</span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{data.title}</h3>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {kpi.label}
            </span>
            <div className="text-xl font-bold text-white">{kpi.value}</div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-slate-400">{kpi.subtext}</span>
              {kpi.change && <span className="text-emerald-400 font-bold font-mono">{kpi.change}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 4-Quadrant SWOT Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <TrendingUp className="w-4 h-4" />
            <span>Strengths (Internal Advantages)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {data.swot.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <AlertCircle className="w-4 h-4" />
            <span>Weaknesses (Operational Friction)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {data.swot.weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-sky-500/30 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <Zap className="w-4 h-4" />
            <span>Opportunities (Market Catalysts)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {data.swot.opportunities.map((o, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Threats &amp; External Exposure</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {data.swot.threats.map((t, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Verdict */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Executive Strategic Verdict
        </h4>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {data.strategicVerdict}
        </p>
      </div>
    </div>
  );
};
