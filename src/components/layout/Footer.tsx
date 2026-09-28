import React from 'react';
import { Heart, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { NexoraLogo } from '../brand/NexoraLogo';

export const Footer: React.FC<{ onOpenAndroidGuide: () => void }> = ({
  onOpenAndroidGuide,
}) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-16 py-8 px-4 sm:px-6 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Creator Credit */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <NexoraLogo size="sm" showSubtitle={true} />
          <p className="text-slate-400 flex items-center gap-1.5 text-[11px] pt-1">
            Designed &amp; Architected with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by{' '}
            <strong className="text-slate-200 font-semibold">Alakh Shukla</strong>
          </p>
        </div>

        {/* Quick Capabilities & Android Link */}
        <div className="flex items-center gap-4 text-slate-400">
          <button
            onClick={onOpenAndroidGuide}
            className="hover:text-emerald-400 transition underline underline-offset-4"
          >
            Android Install (WebAPK)
          </button>
          <span>•</span>
          <span className="hover:text-slate-200 transition">Multi-Model Orchestrator</span>
          <span>•</span>
          <span className="hover:text-slate-200 transition">Zero Scraping Policy</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <p>
          NEXORA AI is an independent multi-provider orchestration command center and is not affiliated with or endorsed by Google, OpenAI, Anthropic, Perplexity, Microsoft, Figma, or Gamma.
        </p>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>BYOK Client Encryption Active</span>
        </div>
      </div>
    </footer>
  );
};
