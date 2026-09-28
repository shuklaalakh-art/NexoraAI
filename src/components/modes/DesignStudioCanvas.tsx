import React, { useState } from 'react';
import { DesignArtifactData } from '../../types';
import { Layout, Palette, Copy, Check, Download, Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface DesignStudioCanvasProps {
  data: DesignArtifactData;
  prompt: string;
}

export const DesignStudioCanvas: React.FC<DesignStudioCanvasProps> = ({ data, prompt }) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'colors' | 'typography' | 'tokens'>('preview');

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedToken(hex);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const handleExportTokensJson = () => {
    const jsonStr = JSON.stringify(
      {
        theme: 'nexora-modern-dark',
        colors: data.colorTokens,
        typography: data.typography,
        spacing: data.spacing,
      },
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design_tokens.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Design System Canvas
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">WCAG 2.2 AAA Verified</span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{data.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTokensJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Figma Tokens (JSON)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-950/60 p-1.5 rounded-xl">
        {[
          { id: 'preview', label: 'Interactive Component Preview', icon: Layers },
          { id: 'colors', label: 'Color Palette Tokens', icon: Palette },
          { id: 'typography', label: 'Typography Scale', icon: Layout },
          { id: 'tokens', label: 'CSS Variables & JSON', icon: Copy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Interactive Component Preview */}
      {activeTab === 'preview' && (
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-center min-h-[380px]">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4 hover:border-purple-400/50 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {data.previewComponent.badgeText}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {data.previewComponent.metricLabel}: {data.previewComponent.metricValue}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-lg text-white">
                {data.previewComponent.headline}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {data.previewComponent.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.previewComponent.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">WCAG AA Certified</span>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition">
                {data.previewComponent.ctaText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Colors */}
      {activeTab === 'colors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.colorTokens.map((token, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition"
            >
              <div
                className="w-full h-14 rounded-lg shadow-inner flex items-end p-2 justify-between"
                style={{ backgroundColor: token.hex }}
              >
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                  {token.hex}
                </span>
                <button
                  onClick={() => handleCopyHex(token.hex)}
                  className="p-1 rounded bg-black/60 hover:bg-black/80 text-white transition"
                  title="Copy Hex Code"
                >
                  {copiedToken === token.hex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div>
                <h5 className="font-bold text-xs text-white">{token.name}</h5>
                <p className="text-[11px] text-slate-400">{token.usage}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Contrast Ratio</span>
                <span className="text-emerald-400 font-bold">{token.contrastRatio}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Typography */}
      {activeTab === 'typography' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h4 className="font-bold text-white text-sm">Typography Scale Tokens</h4>
          <div className="space-y-4">
            {data.typography.map((type, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs text-purple-400 font-mono">
                  <span>{type.label} ({type.size})</span>
                  <span className="text-slate-500">{type.weight}</span>
                </div>
                <p className="text-white font-sans truncate" style={{ fontSize: type.size.split(' / ')[0] }}>
                  {type.sample}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Tokens Raw */}
      {activeTab === 'tokens' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">CSS Custom Properties</h4>
            <button
              onClick={() => {
                const css = `:root {\n${data.colorTokens.map(c => `  --color-${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex};`).join('\n')}\n}`;
                navigator.clipboard.writeText(css);
                setCopiedJson(true);
                setTimeout(() => setCopiedJson(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied' : 'Copy CSS'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-purple-300 overflow-x-auto">
{`:root {
${data.colorTokens.map(c => `  --color-${c.name.toLowerCase().replace(/\s+/g, '-')}: ${c.hex}; /* ${c.contrastRatio} */`).join('\n')}
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
