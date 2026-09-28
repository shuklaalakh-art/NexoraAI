import React, { useState } from 'react';
import { PROVIDERS_REGISTRY } from '../../constants/providers';
import { STORAGE_KEYS } from '../../services/aiOrchestrator';
import {
  Cpu,
  Key,
  ShieldCheck,
  Check,
  AlertTriangle,
  ExternalLink,
  Lock,
  Trash2,
  Save,
  Info,
} from 'lucide-react';

export const ProviderConnectionsView: React.FC = () => {
  const [keys, setKeys] = useState<{ [key: string]: string }>({
    gemini: localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '',
    openai: localStorage.getItem(STORAGE_KEYS.OPENAI_KEY) || '',
    claude: localStorage.getItem(STORAGE_KEYS.CLAUDE_KEY) || '',
    perplexity: localStorage.getItem(STORAGE_KEYS.PERPLEXITY_KEY) || '',
    figma: localStorage.getItem(STORAGE_KEYS.FIGMA_TOKEN) || '',
  });

  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleSaveKey = (provider: string, storageKey: string) => {
    localStorage.setItem(storageKey, keys[provider] || '');
    setSavedStatus(provider);
    setTimeout(() => setSavedStatus(null), 2000);
  };

  const handleClearKey = (provider: string, storageKey: string) => {
    localStorage.removeItem(storageKey);
    setKeys((prev) => ({ ...prev, [provider]: '' }));
    setSavedStatus(provider);
    setTimeout(() => setSavedStatus(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* View Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Provider Integrations &amp; BYOK Key Vault</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          AI Provider Architecture &amp; Credentials
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          NEXORA AI adheres to a strict <strong>Zero-Scraping</strong> policy. Foundation LLM models, Design Context providers, and Presentation engines connect strictly via official authorized APIs. Keys entered here are stored in your encrypted client environment and never transmitted to third-party telemetry.
        </p>
      </div>

      {/* Provider List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROVIDERS_REGISTRY.map((provider) => {
          let storageKey = '';
          if (provider.id === 'gemini') storageKey = STORAGE_KEYS.GEMINI_KEY;
          if (provider.id === 'openai') storageKey = STORAGE_KEYS.OPENAI_KEY;
          if (provider.id === 'claude') storageKey = STORAGE_KEYS.CLAUDE_KEY;
          if (provider.id === 'perplexity') storageKey = STORAGE_KEYS.PERPLEXITY_KEY;
          if (provider.id === 'figma') storageKey = STORAGE_KEYS.FIGMA_TOKEN;

          const isConfigured = !!keys[provider.id];

          return (
            <div
              key={provider.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: provider.color }}
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{provider.name}</h3>
                      <p className="text-[11px] font-mono text-slate-400">
                        Default Model: {provider.model}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                      isConfigured || provider.id === 'gemini' || provider.id === 'gamma'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {isConfigured || provider.id === 'gemini' || provider.id === 'gamma'
                      ? 'Connected / Ready'
                      : 'Auth Required'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {provider.description}
                </p>

                {/* Capabilities pills */}
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-400">
                  {Object.entries(provider.capabilities).map(([cap, enabled]) =>
                    enabled ? (
                      <span
                        key={cap}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800"
                      >
                        ✓ {cap}
                      </span>
                    ) : null
                  )}
                </div>
              </div>

              {/* BYOK Input Form */}
              {storageKey ? (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <label className="text-slate-400 font-medium flex items-center gap-1">
                      <Key className="w-3 h-3 text-slate-500" />
                      <span>BYOK API Key / Token:</span>
                    </label>
                    {savedStatus === provider.id && (
                      <span className="text-emerald-400 text-[10px] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Saved!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={keys[provider.id] || ''}
                      onChange={(e) =>
                        setKeys({ ...keys, [provider.id]: e.target.value })
                      }
                      placeholder={`Enter custom ${provider.name} key`}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500 font-mono"
                    />

                    <button
                      onClick={() => handleSaveKey(provider.id, storageKey)}
                      className="p-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 transition"
                      title="Save Key"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>

                    {keys[provider.id] && (
                      <button
                        onClick={() => handleClearKey(provider.id, storageKey)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                        title="Remove Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  <span>
                    {provider.id === 'copilot'
                      ? 'Managed via Microsoft Entra ID enterprise tenant SSO.'
                      : 'Built-in presentation formatting connector.'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
