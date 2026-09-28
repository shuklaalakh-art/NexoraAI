import React, { useState } from 'react';
import { VerifyArtifactData } from '../../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, Download, ExternalLink } from 'lucide-react';

interface VerifyAuditViewProps {
  data: VerifyArtifactData;
  prompt: string;
}

export const VerifyAuditView: React.FC<VerifyAuditViewProps> = ({ data }) => {
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'verified':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified True
          </span>
        );
      case 'caution':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Nuanced / Caveat
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Unverified
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Fact-Check &amp; Claim Audit
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {data.verifiedCount} of {data.claimsChecked} Claims Confirmed
              </span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">{data.title}</h3>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center gap-2">
            <span className="text-xs text-slate-400">Trust Gauge:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{data.trustScore}%</span>
          </div>
        </div>
      </div>

      {/* Claims Ledger */}
      <div className="space-y-3">
        {data.claims.map((claim) => (
          <div
            key={claim.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500 text-xs uppercase font-bold">
                  {claim.id}:
                </span>
                <h4 className="font-bold text-white text-xs sm:text-sm">
                  &quot;{claim.claim}&quot;
                </h4>
              </div>
              <div>{getVerdictBadge(claim.verdict)}</div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">
                  Evidentiary Finding:
                </span>
                <p className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  {claim.evidence}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
                <span className="text-slate-400">Corroborating Sources:</span>
                {claim.sources.map((s, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-400 font-mono"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
        📌 <strong>Audit Note:</strong> {data.methodologyNote}
      </div>
    </div>
  );
};
