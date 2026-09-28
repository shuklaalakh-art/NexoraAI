import React from 'react';
import { BarChart3, TrendingUp, Zap, Clock, Coins, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const UsageAnalyticsView: React.FC = () => {
  const stats = [
    { label: 'Total Multi-Model Prompts', value: '184', change: '+18% this week', icon: Zap },
    { label: 'Tokens Orchestrated', value: '492,810', change: '+24% this week', icon: TrendingUp },
    { label: 'Avg Multi-Model Latency', value: '880 ms', change: '-120 ms vs p95', icon: Clock },
    { label: 'Estimated API Cost', value: '$1.42', change: 'Optimized routing active', icon: Coins },
  ];

  const providerBreakdown = [
    { name: 'Google Gemini', share: 38, tokens: '187,260', cost: '$0.078', color: '#38bdf8' },
    { name: 'Anthropic Claude', share: 24, tokens: '118,270', cost: '$0.710', color: '#f97316' },
    { name: 'OpenAI ChatGPT', share: 22, tokens: '108,410', cost: '$0.488', color: '#10b981' },
    { name: 'Perplexity Sonar', share: 16, tokens: '78,870', cost: '$0.144', color: '#06b6d4' },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" />
          <span>Usage Dashboard &amp; Token Economics</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          API Consumption &amp; Cost Auditing
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Comprehensive accounting of tokens consumed, model latencies, and expenditure breakdowns across your selected providers.
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">{s.label}</span>
                <Icon className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">{s.value}</p>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span>{s.change}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Provider-Wise Token &amp; Expense Allocation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase text-[10px]">
                <th className="py-2.5">Engine</th>
                <th className="py-2.5">Distribution</th>
                <th className="py-2.5">Total Tokens</th>
                <th className="py-2.5">Est. Cost</th>
                <th className="py-2.5">Optimization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {providerBreakdown.map((item) => (
                <tr key={item.name}>
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.share}%`, backgroundColor: item.color }}
                        />
                      </div>
                      <span className="text-slate-400">{item.share}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{item.tokens}</td>
                  <td className="py-3 text-emerald-400 font-bold">{item.cost}</td>
                  <td className="py-3 text-slate-400 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px]">
                      Optimal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
