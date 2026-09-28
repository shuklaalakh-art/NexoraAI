import React, { useState } from 'react';
import { PROVIDERS_REGISTRY, TASK_MODES, PROMPT_LIBRARY_SEED } from '../../constants/providers';
import { ProviderId, TaskMode } from '../../types';
import { NexoraLogo } from '../brand/NexoraLogo';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  Paperclip,
  Check,
  Bot,
  Zap,
  HelpCircle,
  Search,
  GitCompare,
  Lightbulb,
  PenTool,
  BarChart2,
  Code,
  Layout,
  Tv,
  FileText,
  ShieldCheck,
  Combine,
  Wand2,
  AlertTriangle,
  RotateCcw,
  X,
} from 'lucide-react';

interface CommandBoxProps {
  prompt: string;
  setPrompt: (p: string) => void;
  selectedProviders: ProviderId[];
  setSelectedProviders: (p: ProviderId[]) => void;
  selectedTaskMode: string;
  setSelectedTaskMode: (m: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  autoSelectEnabled: boolean;
  setAutoSelectEnabled: (val: boolean) => void;
}

export const CommandBox: React.FC<CommandBoxProps> = ({
  prompt,
  setPrompt,
  selectedProviders,
  setSelectedProviders,
  selectedTaskMode,
  setSelectedTaskMode,
  onExecute,
  isExecuting,
  autoSelectEnabled,
  setAutoSelectEnabled,
}) => {
  const [showEnhancerModal, setShowEnhancerModal] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);

  // Task icon map
  const getTaskIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle': return HelpCircle;
      case 'Search': return Search;
      case 'GitCompare': return GitCompare;
      case 'Lightbulb': return Lightbulb;
      case 'PenTool': return PenTool;
      case 'BarChart2': return BarChart2;
      case 'Code': return Code;
      case 'Layout': return Layout;
      case 'Tv': return Tv;
      case 'FileText': return FileText;
      case 'ShieldCheck': return ShieldCheck;
      case 'Combine': return Combine;
      default: return HelpCircle;
    }
  };

  const handleToggleProvider = (id: ProviderId) => {
    if (selectedProviders.includes(id)) {
      if (selectedProviders.length > 1) {
        setSelectedProviders(selectedProviders.filter((p) => p !== id));
      }
    } else {
      setSelectedProviders([...selectedProviders, id]);
    }
  };

  const handleSelectAllProviders = () => {
    setSelectedProviders(PROVIDERS_REGISTRY.map((p) => p.id));
  };

  // Smart Auto-Select logic
  const handleAutoSelect = (currentPrompt: string) => {
    const text = currentPrompt.toLowerCase();
    let targets: ProviderId[] = ['gemini', 'openai'];

    if (text.includes('figma') || text.includes('design') || text.includes('ui') || text.includes('accessibility')) {
      targets = ['figma', 'gemini', 'claude'];
      setSelectedTaskMode('design');
    } else if (text.includes('presentation') || text.includes('slide') || text.includes('deck') || text.includes('pitch')) {
      targets = ['gemini', 'claude', 'gamma'];
      setSelectedTaskMode('presentation');
    } else if (text.includes('research') || text.includes('ev') || text.includes('market') || text.includes('india') || text.includes('citations')) {
      targets = ['perplexity', 'gemini', 'claude'];
      setSelectedTaskMode('research');
    } else if (text.includes('code') || text.includes('bug') || text.includes('refactor') || text.includes('api')) {
      targets = ['claude', 'openai', 'gemini'];
      setSelectedTaskMode('code');
    }

    setSelectedProviders(targets);
  };

  // Prompt Enhancer
  const triggerEnhance = () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setShowEnhancerModal(true);

    setTimeout(() => {
      setEnhancedPrompt(
        `Act as an elite strategic advisor and systems architect. Analyze: "${prompt}"\n\nStructure your assessment under the following explicit criteria:\n1. Executive Context & Industry Baseline\n2. Technical & Economic Trade-Offs (with concrete metrics where applicable)\n3. Critical Friction Points & Hidden Bottlenecks\n4. Regulatory, Standard (e.g. AIS/WCAG/GDPR), and Compliance Factors\n5. Actionable Implementation Milestones & Immediate Venture Opportunities`
      );
      setIsEnhancing(false);
    }, 700);
  };

  const applyEnhancedPrompt = () => {
    setPrompt(enhancedPrompt);
    setShowEnhancerModal(false);
  };

  const handleMockFileUpload = () => {
    const mockFiles = [
      { name: 'EV_Battery_Supply_Chain_India_2026.pdf', size: '2.4 MB' },
      { name: 'Dashboard_Design_Tokens.json', size: '142 KB' },
    ];
    setUploadedFiles(mockFiles);
  };

  return (
    <div className="w-full space-y-6">
      {/* Brand Hero Showcase */}
      <div className="text-center space-y-4 pt-2 pb-2">
        <NexoraLogo variant="stacked" size="md" showSubtitle={true} />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium mt-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Unified Multi-Model Intelligence Command Center</span>
        </div>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Ask once. Connect Google Gemini, OpenAI, Claude, Perplexity, Copilot, Figma, and Gamma. Compare, synthesize, and act.
        </p>
      </div>

      {/* Main Omnibox Card */}
      <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-4 sm:p-5 backdrop-blur-xl focus-within:border-sky-500/50 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
        {/* Task Mode Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-800/80 scrollbar-none">
          <span className="text-[11px] font-semibold uppercase text-slate-500 mr-1 shrink-0">
            Task Mode:
          </span>
          {TASK_MODES.map((mode) => {
            const Icon = getTaskIcon(mode.iconName);
            const isSelected = selectedTaskMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setSelectedTaskMode(mode.id);
                  // When clicking presentation or any specific mode, configure providers
                  if (mode.id === 'presentation') {
                    setSelectedProviders(['gemini', 'claude', 'gamma']);
                  } else if (mode.defaultProviders && mode.defaultProviders.length > 0) {
                    setSelectedProviders(mode.defaultProviders);
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-md shadow-sky-500/20'
                    : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
                title={mode.description}
              >
                <Icon className="w-3 h-3" />
                <span>{mode.label}</span>
                {isSelected && mode.id === 'presentation' && (
                  <span className="px-1 py-0.2 rounded text-[9px] bg-pink-500/40 text-pink-200 font-mono">
                    .PPTX
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (autoSelectEnabled) {
                handleAutoSelect(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                if (prompt.trim() && !isExecuting) {
                  onExecute();
                }
              }
            }}
            placeholder={
              selectedTaskMode === 'presentation'
                ? 'Enter presentation topic (e.g. Venture pitch deck outline, EV tech roadmap, or AI enterprise diagnostic platform) — NEXORA will create an interactive slide deck and downloadable .pptx file!'
                : selectedTaskMode === 'code'
                ? 'Describe code or system to implement (e.g. Distributed payment gateway with retry backoff and Vitest tests) — NEXORA will generate source code files and run tests...'
                : selectedTaskMode === 'design'
                ? 'Describe UI design system or frame to audit (e.g. Mobile navigation tokens, WCAG 2.2 AAA contrast, Figma tokens) — NEXORA will generate design tokens and live preview...'
                : selectedTaskMode === 'compare'
                ? 'Enter two or more technologies or strategies to compare (e.g. Microservices vs Monoliths, Kafka vs RabbitMQ) — NEXORA will build an interactive comparison matrix...'
                : selectedTaskMode === 'brainstorm'
                ? 'Enter objective to brainstorm (e.g. AI-driven retention features, zero-ops infrastructure ideas) — NEXORA will generate categorized sticky notes with voting...'
                : selectedTaskMode === 'research'
                ? 'Enter research subject (e.g. EV battery supply chain in India, global 2nm foundry geopolitics) — NEXORA will generate a research dossier with grounded bibliography...'
                : selectedTaskMode === 'verify'
                ? 'Enter claims or assertions to verify — NEXORA will audit each claim with evidence and trust confidence score...'
                : selectedTaskMode === 'analyze'
                ? 'Enter business or technical subject to analyze — NEXORA will generate a 4-quadrant SWOT matrix and KPI analytics...'
                : selectedTaskMode === 'summarize'
                ? 'Enter topic or text to summarize — NEXORA will generate a 30-sec pitch, executive bullet takeaways, and voice audio brief...'
                : selectedTaskMode === 'write'
                ? 'Enter article topic — NEXORA will format a publication-ready editorial article with reading metrics...'
                : 'What would you like to ask? (Compare architectures, explain quantum computing, or analyze with frontier models...)'
            }
            rows={4}
            className="w-full bg-transparent resize-none outline-none text-slate-100 placeholder:text-slate-500 text-sm sm:text-base leading-relaxed pr-24"
          />

          {/* Prompt Actions inside input */}
          <div className="absolute right-1 bottom-1 flex items-center gap-1.5">
            {prompt.trim() && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium transition"
                title="Clear input"
              >
                <X className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}

            <button
              onClick={triggerEnhance}
              disabled={!prompt.trim()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="Enhance prompt with structured strategic parameters"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Enhance</span>
            </button>
          </div>
        </div>

        {/* Attached files chips */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-500">Attached Context:</span>
            {uploadedFiles.map((file, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-xs text-sky-300 font-mono"
              >
                <Paperclip className="w-3 h-3 text-slate-400" />
                <span>{file.name}</span>
                <span className="text-[10px] text-slate-500">({file.size})</span>
              </span>
            ))}
          </div>
        )}

        {/* Omnibox Footer Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            {/* File attachment button */}
            <button
              onClick={handleMockFileUpload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition"
              title="Attach PDF, DOCX, XLSX, Images, or Figma tokens"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Attach Context</span>
            </button>

            {/* Auto-Select Toggle */}
            <button
              onClick={() => {
                const nextVal = !autoSelectEnabled;
                setAutoSelectEnabled(nextVal);
                if (nextVal) handleAutoSelect(prompt);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                autoSelectEnabled
                  ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Automatically select optimal models based on prompt intent"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Smart Routing</span>
              {autoSelectEnabled && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
            </button>
          </div>

          {/* Run Action Button */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Selected: <strong className="text-white">{selectedProviders.length}</strong> AI Engine{selectedProviders.length > 1 ? 's' : ''}
            </span>

            <button
              onClick={onExecute}
              disabled={isExecuting || !prompt.trim()}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                selectedTaskMode === 'presentation'
                  ? 'bg-gradient-to-r from-pink-500 via-rose-600 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white shadow-pink-500/25'
                  : selectedTaskMode === 'code'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25'
                  : selectedTaskMode === 'design'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-purple-500/25'
                  : 'bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white shadow-sky-500/25'
              }`}
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {selectedTaskMode === 'presentation'
                      ? 'Creating PPT Deck...'
                      : 'Orchestrating...'}
                  </span>
                </>
              ) : selectedTaskMode === 'presentation' ? (
                <>
                  <Tv className="w-4 h-4" />
                  <span>CREATE PPT &amp; SLIDES</span>
                </>
              ) : selectedTaskMode === 'code' ? (
                <>
                  <Code className="w-4 h-4" />
                  <span>BUILD CODE &amp; RUN TESTS</span>
                </>
              ) : selectedTaskMode === 'design' ? (
                <>
                  <Layout className="w-4 h-4" />
                  <span>BUILD DESIGN TOKENS</span>
                </>
              ) : selectedTaskMode === 'compare' ? (
                <>
                  <GitCompare className="w-4 h-4" />
                  <span>COMPARE MATRIX</span>
                </>
              ) : selectedTaskMode === 'brainstorm' ? (
                <>
                  <Lightbulb className="w-4 h-4" />
                  <span>LAUNCH BRAINSTORM</span>
                </>
              ) : selectedTaskMode === 'research' ? (
                <>
                  <Search className="w-4 h-4" />
                  <span>RESEARCH DOSSIER</span>
                </>
              ) : selectedTaskMode === 'verify' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>FACT-CHECK AUDIT</span>
                </>
              ) : selectedTaskMode === 'analyze' ? (
                <>
                  <BarChart2 className="w-4 h-4" />
                  <span>GENERATE SWOT</span>
                </>
              ) : selectedTaskMode === 'summarize' ? (
                <>
                  <FileText className="w-4 h-4" />
                  <span>1-PAGER &amp; AUDIO</span>
                </>
              ) : selectedTaskMode === 'write' ? (
                <>
                  <PenTool className="w-4 h-4" />
                  <span>WRITE ARTICLE</span>
                </>
              ) : (
                <>
                  <span>ASK NEXORA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Provider Selector Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Choose Your Intelligence
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">
              Multi-model parallel orchestration
            </span>
          </div>
          <button
            onClick={handleSelectAllProviders}
            className="text-sky-400 hover:text-sky-300 transition text-[11px] font-medium"
          >
            Select All Engines
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {PROVIDERS_REGISTRY.map((provider) => {
            const isSelected = selectedProviders.includes(provider.id);
            return (
              <div
                key={provider.id}
                onClick={() => handleToggleProvider(provider.id)}
                className={`relative flex flex-col justify-between p-3 rounded-xl border cursor-pointer select-none transition-all group ${
                  isSelected
                    ? `${provider.bgTint} ${provider.accentBorder} ring-1 ring-white/10 shadow-lg`
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: provider.color }}
                    />
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'border border-slate-700 bg-slate-950'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <p className="font-bold text-xs text-white leading-tight mb-0.5">
                    {provider.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">
                    {provider.model}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 truncate">
                    {provider.category === 'design'
                      ? 'Design'
                      : provider.category === 'presentation'
                      ? 'Slides'
                      : 'Foundation'}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                      provider.status === 'connected'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {provider.status === 'connected' ? 'Ready' : 'Auth'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 text-xs">
          <span className="text-[11px] text-slate-500 font-medium">Quick Starters:</span>
          {[
            'Compare microservices vs monolith architectures',
            'Explain quantum computing & recent breakthrough milestones',
            'Audit UI design system tokens for WCAG 2.2 accessibility',
            'Develop an AI agent workflow for automated customer support',
          ].map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(suggestion)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-sky-300 transition"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Enhancer Modal */}
      {showEnhancerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Prompt Enhancer</h3>
              </div>
              <button
                onClick={() => setShowEnhancerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 font-medium mb-1">Original Prompt:</p>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                  {prompt}
                </div>
              </div>

              <div>
                <p className="text-indigo-400 font-medium mb-1">
                  {isEnhancing ? 'Structuring enhanced prompt...' : 'Enhanced Strategic Prompt Preview:'}
                </p>
                {isEnhancing ? (
                  <div className="p-6 flex items-center justify-center gap-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-400">
                    <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing intent and structuring rubrics...</span>
                  </div>
                ) : (
                  <textarea
                    value={enhancedPrompt}
                    onChange={(e) => setEnhancedPrompt(e.target.value)}
                    rows={6}
                    className="w-full p-3 bg-slate-950 rounded-lg border border-indigo-500/40 text-slate-200 outline-none focus:border-indigo-400 font-mono text-[11px]"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowEnhancerModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={applyEnhancedPrompt}
                disabled={isEnhancing}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition disabled:opacity-50"
              >
                Apply to Omnibox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
