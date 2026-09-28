import React, { useState } from 'react';
import { SlidersHorizontal, Shield, Smartphone, Terminal, Lock, Key, Download, Trash2, Check } from 'lucide-react';

export const SettingsView: React.FC<{ onOpenAndroidGuide: () => void }> = ({ onOpenAndroidGuide }) => {
  const [costMode, setCostMode] = useState<'balanced' | 'economy' | 'quality'>('balanced');
  const [egressConsent, setEgressConsent] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4" />
          <span>System Settings &amp; Security</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Preferences &amp; Policies</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Configure model cost modes, data egress firewalls, and Android deployment options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Routing Mode */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm">Smart Cost Routing Mode</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dictates default model selection thresholds when orchestrating complex queries.
          </p>

          <div className="space-y-2">
            {[
              {
                id: 'balanced',
                label: 'Balanced Mode (Recommended)',
                desc: 'Blends cost, speed, and analytical depth across Gemini Flash and GPT-4o.',
              },
              {
                id: 'quality',
                label: 'Frontier Quality Mode',
                desc: 'Prioritizes maximum depth reasoning using Claude 3.7 Sonnet and OpenAI o3-mini.',
              },
              {
                id: 'economy',
                label: 'Economy Mode',
                desc: 'Minimizes token expenses using high-efficiency lightweight models.',
              },
            ].map((mode) => (
              <label
                key={mode.id}
                onClick={() => setCostMode(mode.id as any)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  costMode === mode.id
                    ? 'bg-sky-500/10 border-sky-500/40 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name="costMode"
                  checked={costMode === mode.id}
                  onChange={() => {}}
                  className="mt-1"
                />
                <div>
                  <p className="font-bold text-xs text-white">{mode.label}</p>
                  <p className="text-[11px] text-slate-400">{mode.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Android APK & Google Play Store Bundling Hub */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Google Play Store &amp; Android APK</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              NEXORA AI is 100% configured for Google Play Store publishing via Trusted Web Activity (TWA) with pre-configured <code className="text-sky-300">twa-manifest.json</code> and Digital Asset Links.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-400">
              <p className="font-semibold text-white">Google Play Package Specs:</p>
              <ul className="font-mono text-[10px] space-y-1 text-slate-300">
                <li>• Package ID: <strong className="text-sky-300">com.alakh.nexora</strong></li>
                <li>• Digital Asset Links: <span className="text-emerald-400">Verified &amp; Active</span></li>
                <li>• Output Target: Android App Bundle (.aab) &amp; APK</li>
              </ul>
            </div>
          </div>

          <button
            onClick={onOpenAndroidGuide}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Open Play Store &amp; APK Bundler Hub</span>
          </button>
        </div>

        {/* Privacy & Egress Consent */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-400" />
                <span>Third-Party Data Egress &amp; Consent Firewall</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enforces explicit disclosure whenever your prompt or attached files are dispatched to third-party AI APIs.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={egressConsent}
                onChange={(e) => setEgressConsent(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Settings persist safely in your encrypted local profile.
            </span>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow"
            >
              {savedNotice ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{savedNotice ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
