import React, { useState, useEffect, useMemo } from 'react';
import { NormalizedAIResponse, ConsensusAnalysis, ProviderId } from '../../types';
import { PROVIDERS_REGISTRY, TASK_MODES } from '../../constants/providers';
import { MarkdownViewer } from '../common/MarkdownViewer';
import { PresentationDeckStudio } from '../modes/PresentationDeckStudio';
import { CodeStudioWorkbench } from '../modes/CodeStudioWorkbench';
import { DesignStudioCanvas } from '../modes/DesignStudioCanvas';
import { CompareMatrixView } from '../modes/CompareMatrixView';
import { BrainstormBoardView } from '../modes/BrainstormBoardView';
import { ResearchDossierView } from '../modes/ResearchDossierView';
import { VerifyAuditView } from '../modes/VerifyAuditView';
import { AnalyzeSwotView } from '../modes/AnalyzeSwotView';
import { SummarizeBriefView } from '../modes/SummarizeBriefView';
import { WriteStudioView } from '../modes/WriteStudioView';
import {
  generatePresentationDeck,
  generateCodeArtifact,
  generateDesignArtifact,
  generateCompareArtifact,
  generateBrainstormArtifact,
  generateResearchDossier,
  generateVerifyArtifact,
  generateAnalyzeArtifact,
  generateSummarizeArtifact,
  generateWriteArtifact,
} from '../../services/modeArtifactGenerators';
import {
  FileText,
  GitCompare,
  ExternalLink,
  Paperclip,
  Activity,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Send,
  Loader2,
  Cpu,
  Tv,
  Code,
  Layout,
  Lightbulb,
  Search,
  ShieldCheck,
  BarChart2,
  PenTool,
  Combine,
  HelpCircle,
} from 'lucide-react';

interface ResponseWorkspaceProps {
  prompt: string;
  responses: NormalizedAIResponse[];
  consensus: ConsensusAnalysis | null;
  onSynthesize: () => void;
  isSynthesizing: boolean;
  onSendToProvider: (target: ProviderId, content: string) => void;
  onSaveToWorkspace: () => void;
  isExecuting?: boolean;
  selectedProviders?: ProviderId[];
  taskMode?: string;
  onTaskModeChange?: (mode: string) => void;
}

export const ResponseWorkspace: React.FC<ResponseWorkspaceProps> = ({
  prompt,
  responses,
  consensus,
  onSynthesize,
  isSynthesizing,
  onSendToProvider,
  onSaveToWorkspace,
  isExecuting = false,
  selectedProviders = ['gemini', 'openai', 'claude', 'perplexity'],
  taskMode = 'presentation',
  onTaskModeChange,
}) => {
  const [currentMode, setCurrentMode] = useState<string>(taskMode);
  const [activeTab, setActiveTab] = useState<
    'mode_artifact' | 'combined' | 'individual' | 'compare' | 'sources' | 'files' | 'activity'
  >('mode_artifact');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIndividual, setSelectedIndividual] = useState<ProviderId>(
    responses[0]?.provider || selectedProviders[0] || 'gemini'
  );

  // Sync currentMode when taskMode prop updates
  useEffect(() => {
    if (taskMode) {
      setCurrentMode(taskMode);
      setActiveTab('mode_artifact');
    }
  }, [taskMode]);

  // Keep selected individual synced if responses update
  useEffect(() => {
    if (responses.length > 0 && !responses.some((r) => r.provider === selectedIndividual)) {
      setSelectedIndividual(responses[0].provider);
    }
  }, [responses, selectedIndividual]);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getProviderMeta = (id: ProviderId) => {
    return PROVIDERS_REGISTRY.find((p) => p.id === id) || PROVIDERS_REGISTRY[0];
  };

  const allCitations = responses.flatMap((r) => r.citations || []);

  // Mode Artifacts generated deterministically & intelligently from prompt & consensus
  const presentationDeck = useMemo(
    () => generatePresentationDeck(prompt, consensus?.synthesizedExecutiveReport, responses),
    [prompt, consensus, responses]
  );
  const codeArtifact = useMemo(
    () => generateCodeArtifact(prompt),
    [prompt]
  );
  const designArtifact = useMemo(
    () => generateDesignArtifact(prompt),
    [prompt]
  );
  const compareArtifact = useMemo(
    () => generateCompareArtifact(prompt),
    [prompt]
  );
  const brainstormArtifact = useMemo(
    () => generateBrainstormArtifact(prompt),
    [prompt]
  );
  const researchDossier = useMemo(
    () => generateResearchDossier(prompt, allCitations),
    [prompt, allCitations]
  );
  const verifyArtifact = useMemo(
    () => generateVerifyArtifact(prompt),
    [prompt]
  );
  const analyzeArtifact = useMemo(
    () => generateAnalyzeArtifact(prompt),
    [prompt]
  );
  const summarizeArtifact = useMemo(
    () => generateSummarizeArtifact(prompt, consensus?.synthesizedExecutiveReport),
    [prompt, consensus]
  );
  const writeArtifact = useMemo(
    () => generateWriteArtifact(prompt, consensus?.synthesizedExecutiveReport),
    [prompt, consensus]
  );

  // Mode meta configuration
  const modeMeta = useMemo(() => {
    switch (currentMode) {
      case 'presentation':
        return {
          title: 'Presentation Deck (.PPTX)',
          icon: Tv,
          color: 'text-pink-400',
          badgeBg: 'bg-pink-500/10 border-pink-500/30 text-pink-400',
          label: 'Interactive Presentation Studio',
        };
      case 'code':
        return {
          title: 'Code Studio & Sandbox',
          icon: Code,
          color: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          label: 'Code Workbench & Tests',
        };
      case 'design':
        return {
          title: 'Design System Canvas',
          icon: Layout,
          color: 'text-purple-400',
          badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          label: 'UI Components & Figma Tokens',
        };
      case 'compare':
        return {
          title: 'Comparative Matrix',
          icon: GitCompare,
          color: 'text-cyan-400',
          badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          label: 'Side-by-Side Trade-off Grid',
        };
      case 'brainstorm':
        return {
          title: 'Brainstorm Idea Board',
          icon: Lightbulb,
          color: 'text-amber-400',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          label: 'Categorized Sticky Notes',
        };
      case 'research':
        return {
          title: 'Research Dossier',
          icon: Search,
          color: 'text-sky-400',
          badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          label: 'Peer-Reviewed Whitepaper',
        };
      case 'verify':
        return {
          title: 'Fact-Check Audit',
          icon: ShieldCheck,
          color: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          label: 'Claim-by-Claim Verification',
        };
      case 'analyze':
        return {
          title: 'Strategic SWOT & KPI',
          icon: BarChart2,
          color: 'text-indigo-400',
          badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
          label: '4-Quadrant SWOT Matrix',
        };
      case 'summarize':
        return {
          title: '1-Pager & Audio Brief',
          icon: FileText,
          color: 'text-amber-400',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          label: '30-Sec Pitch & Voice Player',
        };
      case 'write':
        return {
          title: 'Editorial Article Studio',
          icon: PenTool,
          color: 'text-orange-400',
          badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          label: 'Formatted Publication Draft',
        };
      default:
        return {
          title: 'Mode Output',
          icon: Sparkles,
          color: 'text-sky-400',
          badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          label: 'Specialized Task Result',
        };
    }
  }, [currentMode]);

  const handleModeSwitch = (modeId: string) => {
    setCurrentMode(modeId);
    setActiveTab('mode_artifact');
    onTaskModeChange?.(modeId);
  };

  // LOADING STATE DURING PARALLEL ORCHESTRATION
  if (isExecuting) {
    return (
      <div className="w-full space-y-6 animate-in fade-in duration-300">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Gradient pulse line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-pink-500 to-indigo-500 animate-pulse" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                  <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
                  Generating Mode Artifact: {modeMeta.label}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {selectedProviders.length} Engines Active
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-2">
                &quot;{prompt}&quot;
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 animate-pulse">
                Synthesizing multi-model artifacts...
              </span>
            </div>
          </div>

          {/* Model Status Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
            {selectedProviders.map((pid, idx) => {
              const meta = getProviderMeta(pid);
              return (
                <div
                  key={pid}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 relative overflow-hidden group"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: meta.color }} />
                      <span className="font-bold text-xs text-white">{meta.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{meta.model}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                    <Cpu className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                    <span className="text-[11px]">Synthesizing {modeMeta.title}...</span>
                  </div>

                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 via-pink-500 to-indigo-500 rounded-full animate-pulse"
                      style={{ width: `${60 + idx * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // If no responses and not executing, return null
  if (responses.length === 0) {
    return null;
  }

  const ModeIcon = modeMeta.icon;

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Session Title Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${modeMeta.badgeBg}`}>
              <ModeIcon className="w-3.5 h-3.5" />
              <span>{modeMeta.label}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              {responses.length} Models Responded
            </span>
            {consensus && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {consensus.agreementScore}% Alignment
                </span>
              </>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
            &quot;{prompt}&quot;
          </h2>
        </div>

        {/* Global Workspace Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSynthesize}
            disabled={isSynthesizing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSynthesizing ? 'Synthesizing...' : 'Regenerate'}</span>
          </button>

          <button
            onClick={onSaveToWorkspace}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save to Folder</span>
          </button>
        </div>
      </div>

      {/* Quick Mode Switcher Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
        <span className="text-[11px] font-semibold text-slate-500 uppercase shrink-0 mr-1">
          Switch Output:
        </span>
        {[
          { id: 'presentation', label: 'Presentation (PPT)', icon: Tv },
          { id: 'code', label: 'Code Sandbox', icon: Code },
          { id: 'design', label: 'Design Tokens', icon: Layout },
          { id: 'compare', label: 'Compare Matrix', icon: GitCompare },
          { id: 'brainstorm', label: 'Brainstorm Board', icon: Lightbulb },
          { id: 'research', label: 'Research Dossier', icon: Search },
          { id: 'verify', label: 'Fact-Check Audit', icon: ShieldCheck },
          { id: 'analyze', label: 'SWOT & Analytics', icon: BarChart2 },
          { id: 'summarize', label: '1-Pager & Audio', icon: FileText },
          { id: 'write', label: 'Editorial Draft', icon: PenTool },
        ].map((m) => {
          const Icon = m.icon;
          const isSelected = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleModeSwitch(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspace Tabs Header */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/60 rounded-t-xl px-2 gap-1 overflow-x-auto scrollbar-none">
        {/* Tab 0: Active Mode Artifact */}
        <button
          onClick={() => setActiveTab('mode_artifact')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'mode_artifact'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-900/30'
          }`}
        >
          <ModeIcon className="w-4 h-4 text-sky-400" />
          <span>🎯 {modeMeta.title}</span>
        </button>

        {/* Tab 1: Combined Master Insight */}
        <button
          onClick={() => setActiveTab('combined')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'combined'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Consensus Synthesis</span>
        </button>

        {/* Tab 2: Individual Responses */}
        <button
          onClick={() => setActiveTab('individual')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'individual'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Individual Models ({responses.length})</span>
        </button>

        {/* Tab 3: Sources */}
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'sources'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Grounded Sources ({allCitations.length})</span>
        </button>

        {/* Tab 4: Activity & Cost */}
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'activity'
              ? 'border-sky-500 text-sky-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Activity &amp; Telemetry</span>
        </button>
      </div>

      {/* TAB CONTENT 0: MODE ARTIFACT (What this mode is meant to do) */}
      {activeTab === 'mode_artifact' && (
        <div className="space-y-6">
          {currentMode === 'presentation' && (
            <PresentationDeckStudio deck={presentationDeck} prompt={prompt} />
          )}

          {currentMode === 'code' && (
            <CodeStudioWorkbench data={codeArtifact} prompt={prompt} />
          )}

          {currentMode === 'design' && (
            <DesignStudioCanvas data={designArtifact} prompt={prompt} />
          )}

          {currentMode === 'compare' && (
            <CompareMatrixView data={compareArtifact} prompt={prompt} />
          )}

          {currentMode === 'brainstorm' && (
            <BrainstormBoardView data={brainstormArtifact} prompt={prompt} />
          )}

          {currentMode === 'research' && (
            <ResearchDossierView data={researchDossier} prompt={prompt} />
          )}

          {currentMode === 'verify' && (
            <VerifyAuditView data={verifyArtifact} prompt={prompt} />
          )}

          {currentMode === 'analyze' && (
            <AnalyzeSwotView data={analyzeArtifact} prompt={prompt} />
          )}

          {currentMode === 'summarize' && (
            <SummarizeBriefView data={summarizeArtifact} prompt={prompt} />
          )}

          {currentMode === 'write' && (
            <WriteStudioView data={writeArtifact} prompt={prompt} />
          )}

          {/* If Ask or Synthesize, provide direct tailored summary with quick deck export */}
          {(currentMode === 'ask' || currentMode === 'synthesize') && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-400" />
                    <h3 className="font-bold text-white text-base">Direct Synthesis &amp; Action Plan</h3>
                  </div>
                  <button
                    onClick={() => handleModeSwitch('presentation')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold hover:bg-pink-500/30 transition"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Convert to PPT Deck</span>
                  </button>
                </div>
                <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-sm">
                  <MarkdownViewer content={consensus?.synthesizedExecutiveReport || responses[0]?.content || ''} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: COMBINED MASTER SYNTHESIS */}
      {activeTab === 'combined' && (
        <div className="space-y-6">
          {consensus ? (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-xl">
              {/* Top Meta info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Master AI-Generated Synthesis
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {consensus.generatedBy}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyText(consensus.synthesizedExecutiveReport, 'synth')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 px-2.5 transition"
                  >
                    {copiedId === 'synth' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'synth' ? 'Copied' : 'Copy Report'}</span>
                  </button>
                </div>
              </div>

              {/* Consensus Meter Banner */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      Consensus Rating:
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      Strong Multi-Model Alignment ({consensus.agreementScore}%)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xl">
                    Multiple frontier models independently reached complementary conclusions.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {responses.map((r) => {
                    const meta = getProviderMeta(r.provider);
                    return (
                      <span
                        key={r.provider}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                        {meta.name.split(' ')[0]}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Formatted Markdown Output */}
              <div className="p-5 sm:p-6 bg-slate-950/70 rounded-xl border border-slate-800/80 shadow-inner">
                <MarkdownViewer content={consensus.synthesizedExecutiveReport} />
              </div>

              {/* Cross-Model Handoff Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-medium">
                  Cross-Model Handoff:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleModeSwitch('presentation')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 text-xs font-semibold transition"
                  >
                    <Tv className="w-3 h-3" />
                    <span>Create PPT Presentation Deck</span>
                  </button>

                  <button
                    onClick={() => onSendToProvider('claude', consensus.synthesizedExecutiveReport)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Continue with Claude</span>
                  </button>

                  <button
                    onClick={() => onSendToProvider('gemini', consensus.synthesizedExecutiveReport)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Summarize with Gemini</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <Sparkles className="w-8 h-8 text-sky-400 mx-auto" />
              <h3 className="font-bold text-white text-base">Generate Synthesis</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Consolidate {responses.length} individual provider responses into an executive master briefing.
              </p>
              <button
                onClick={onSynthesize}
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg transition active:scale-95"
              >
                Run Synthesis Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INDIVIDUAL MODEL RESPONSES */}
      {activeTab === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              Select Response:
            </span>
            <div className="space-y-1.5">
              {responses.map((resp) => {
                const meta = getProviderMeta(resp.provider);
                const isSelected = selectedIndividual === resp.provider;
                return (
                  <button
                    key={resp.provider}
                    onClick={() => setSelectedIndividual(resp.provider)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? `${meta.bgTint} ${meta.accentBorder} text-white shadow-md`
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                        <span className="font-bold text-xs text-white">{meta.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {resp.model}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {resp.latencyMs}ms
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            {(() => {
              const activeResp =
                responses.find((r) => r.provider === selectedIndividual) || responses[0];
              if (!activeResp) return null;
              const meta = getProviderMeta(activeResp.provider);

              return (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm"
                        style={{ backgroundColor: meta.color }}
                      >
                        {meta.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-sm">{meta.name}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {activeResp.model}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Generated at {activeResp.timestamp} • Latency: {activeResp.latencyMs}ms • Tokens: ~{activeResp.usage?.totalTokens || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyText(activeResp.content, activeResp.requestId)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 px-2.5 transition"
                      >
                        {copiedId === activeResp.requestId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === activeResp.requestId ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-950 rounded-xl border border-slate-800/80 shadow-inner">
                    <MarkdownViewer content={activeResp.content} />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 3: SOURCES & CITATIONS */}
      {activeTab === 'sources' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm">Grounded Sources &amp; Citations</h3>
              <p className="text-xs text-slate-400">
                Authentic references returned by live search and verified model knowledge.
              </p>
            </div>
            <span className="text-xs font-mono text-sky-400 font-semibold">
              {allCitations.length} Grounded Sources
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {allCitations.map((c) => {
              const meta = getProviderMeta(c.provider);
              return (
                <div key={c.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold"
                      style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                    >
                      {meta.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{c.date || 'Verified'}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs hover:text-sky-300 transition">
                    {c.title}
                  </h4>
                  {c.snippet && <p className="text-[11px] text-slate-400 line-clamp-2">{c.snippet}</p>}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                    <span>{c.domain}</span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400 hover:underline flex items-center gap-1"
                    >
                      Visit <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY & TELEMETRY */}
      {activeTab === 'activity' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm">Execution Activity &amp; Cost Audit</h3>
              <p className="text-xs text-slate-400">
                Detailed telemetry on latency, token consumption, and estimated API expenses.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Total Est: ${responses.reduce((sum, r) => sum + (r.usage?.estimatedCostUsd || 0), 0).toFixed(5)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase text-[10px]">
                  <th className="py-2">Provider</th>
                  <th className="py-2">Model</th>
                  <th className="py-2">Latency</th>
                  <th className="py-2">Tokens</th>
                  <th className="py-2">Est. Cost</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {responses.map((r) => {
                  const meta = getProviderMeta(r.provider);
                  return (
                    <tr key={r.provider}>
                      <td className="py-2.5 font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                        {meta.name}
                      </td>
                      <td className="py-2.5 text-slate-400">{r.model}</td>
                      <td className="py-2.5 text-slate-300">{r.latencyMs} ms</td>
                      <td className="py-2.5 text-slate-300">{r.usage?.totalTokens || 0}</td>
                      <td className="py-2.5 text-emerald-400">
                        ${(r.usage?.estimatedCostUsd || 0).toFixed(5)}
                      </td>
                      <td className="py-2.5 text-emerald-400 font-sans">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px]">
                          OK
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
