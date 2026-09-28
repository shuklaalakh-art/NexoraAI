import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Check, X, Share2, Info, Copy, Globe, ExternalLink } from 'lucide-react';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, install } = usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const liveDevUrl = 'https://ais-dev-bgl2gyeaiqntktnyu37xr7-417602105349.asia-east1.run.app';
  const currentUrl = typeof window !== 'undefined' && window.location.origin.includes('ais-')
    ? window.location.origin
    : liveDevUrl;

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstallClick = async () => {
    setInstalling(true);
    const success = await install();
    setInstalling(false);
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Install NEXORA AI</h3>
              <p className="text-xs text-slate-400">Android PWA & Home Screen App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Info className="w-3.5 h-3.5" />
              <span>Native Android App Experience</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Install NEXORA AI on your Android device or Chromebook directly without leaving your browser. It launches in full-screen standalone mode with zero address bar, fast offline cache, and native OS app-drawer integration.
            </p>
          </div>

          {/* Quick steps */}
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Installation Capabilities:
            </p>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Runs as a standalone native Android app (WebAPK / PWA)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Saves offline conversations, prompts, and workspace cache</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instant launch icon in your Android App Drawer & Home Screen</span>
              </li>
            </ul>
          </div>

          {/* Installation URL Box */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                WebAPK Link (Open on Android):
              </span>
              <button
                onClick={copyUrl}
                className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[11px] font-semibold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
            <div className="font-mono text-[10px] text-slate-300 bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 truncate select-all">
              {currentUrl}
            </div>
          </div>

          {/* iOS instruction fallback */}
          {isIOS && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" /> On iOS / Safari:
              </p>
              <p className="text-[11px] text-indigo-300 leading-relaxed">
                Tap the <strong>Share</strong> button in Safari’s toolbar, scroll down, and select <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
            </div>
          )}

          {/* Android browser menu fallback if browser already prompted */}
          {!isInstallable && !isInstalled && !isIOS && (
            <div className="p-3.5 bg-sky-950/40 border border-sky-500/30 rounded-xl text-xs text-sky-200 space-y-2">
              <p className="font-semibold text-sky-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                In the Chrome &quot;Install and create shortcut&quot; popup:
              </p>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-sky-500/20 space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                <p>
                  👉 Tap <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Create shortcut</strong> (or &quot;Add to Home screen&quot;).
                </p>
                <p className="text-slate-400 text-[10px]">
                  This places the NEXORA AI app icon right onto your Android Home Screen immediately!
                </p>
                <p className="text-amber-300/90 text-[10px] pt-1 border-t border-slate-800/80">
                  ℹ️ <em>Why does &quot;Install&quot; say cannot be installed?</em> Because Google&apos;s WebAPK server requires the public URL (click <strong>Share</strong> in AI Studio). Tapping <strong>Create shortcut</strong> works right now on this dev server.
                </p>
              </div>
            </div>
          )}

          {isInstalled && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>NEXORA AI is already installed on this device!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            Close
          </button>

          {isInstallable && !isInstalled && (
            <button
              onClick={handleInstallClick}
              disabled={installing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-sky-500/25 transition active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{installing ? 'Installing...' : 'Install on Android / Device'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
