import React, { useState, useRef } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AndroidInstallGuideModal } from './components/layout/AndroidInstallGuideModal';
import { CommandBox } from './components/command/CommandBox';
import { ResponseWorkspace } from './components/workspace/ResponseWorkspace';
import { ProviderConnectionsView } from './components/connections/ProviderConnectionsView';
import { PromptLibraryView } from './components/library/PromptLibraryView';
import { KnowledgeWorkspaceView } from './components/knowledge/KnowledgeWorkspaceView';
import { UsageAnalyticsView } from './components/analytics/UsageAnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { ProviderId, NormalizedAIResponse, ConsensusAnalysis } from './types';
import {
  executeMultiModelQuery,
  generateConsensusAndSynthesis,
} from './services/aiOrchestrator';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('command');
  const [isAndroidGuideOpen, setIsAndroidGuideOpen] = useState(false);

  // Omnibox state
  const [prompt, setPrompt] = useState(
    'Compare microservices vs monolith architectures with concrete trade-offs and recommendations'
  );
  const [executedPrompt, setExecutedPrompt] = useState<string>('');
  const [selectedProviders, setSelectedProviders] = useState<ProviderId[]>([
    'gemini',
    'openai',
    'claude',
    'perplexity',
  ]);
  const [selectedTaskMode, setSelectedTaskMode] = useState<string>('research');
  const [autoSelectEnabled, setAutoSelectEnabled] = useState(false);

  // Execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [responses, setResponses] = useState<NormalizedAIResponse[]>([]);
  const [consensus, setConsensus] = useState<ConsensusAnalysis | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [hasRunQuery, setHasRunQuery] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run execution
  const handleExecute = async () => {
    const query = prompt.trim();
    if (!query || selectedProviders.length === 0) return;

    setIsExecuting(true);
    setHasRunQuery(true);
    setExecutedPrompt(query);

    // Scroll smoothly to results area
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const results = await executeMultiModelQuery(
        query,
        selectedProviders,
        selectedTaskMode
      );
      setResponses(results);

      // Automatically compute consensus & synthesis
      const syn = generateConsensusAndSynthesis(query, results);
      setConsensus(syn);
    } catch (e) {
      console.error('Execution error:', e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSynthesize = () => {
    const activeQuery = executedPrompt || prompt;
    if (responses.length === 0) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      const syn = generateConsensusAndSynthesis(activeQuery, responses);
      setConsensus(syn);
      setIsSynthesizing(false);
      showToast('Consensus analysis regenerated across frontier models');
    }, 500);
  };

  const handleSendToProvider = (target: ProviderId, content: string) => {
    setSelectedProviders([target]);
    setPrompt(`Continue refining this research:\n\n${content.slice(0, 500)}...`);
    setCurrentTab('command');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Handoff transferred to ${target.toUpperCase()}`);
  };

  const handleSaveToWorkspace = () => {
    showToast('Session saved to Workspace -> "Research Sessions" folder');
  };

  const handleLoadPromptFromLibrary = (promptText: string) => {
    setPrompt(promptText);
    setCurrentTab('command');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentTab === 'command' && (
          <div className="space-y-10">
            <CommandBox
              prompt={prompt}
              setPrompt={setPrompt}
              selectedProviders={selectedProviders}
              setSelectedProviders={setSelectedProviders}
              selectedTaskMode={selectedTaskMode}
              setSelectedTaskMode={setSelectedTaskMode}
              onExecute={handleExecute}
              isExecuting={isExecuting}
              autoSelectEnabled={autoSelectEnabled}
              setAutoSelectEnabled={setAutoSelectEnabled}
            />

            {/* Display Results Workspace once executed or while executing */}
            {(hasRunQuery || isExecuting || responses.length > 0) && (
              <div ref={resultsRef} className="pt-6 border-t border-slate-800/80">
                <ResponseWorkspace
                  prompt={executedPrompt || prompt}
                  responses={responses}
                  consensus={consensus}
                  onSynthesize={handleSynthesize}
                  isSynthesizing={isSynthesizing}
                  onSendToProvider={handleSendToProvider}
                  onSaveToWorkspace={handleSaveToWorkspace}
                  isExecuting={isExecuting}
                  selectedProviders={selectedProviders}
                  taskMode={selectedTaskMode}
                  onTaskModeChange={setSelectedTaskMode}
                />
              </div>
            )}
          </div>
        )}

        {currentTab === 'workspace' && (
          <KnowledgeWorkspaceView onLoadSessionPrompt={handleLoadPromptFromLibrary} />
        )}

        {currentTab === 'prompts' && (
          <PromptLibraryView onSelectPrompt={handleLoadPromptFromLibrary} />
        )}

        {currentTab === 'connections' && <ProviderConnectionsView />}

        {currentTab === 'analytics' && <UsageAnalyticsView />}

        {currentTab === 'settings' && (
          <SettingsView onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenAndroidGuide={() => setIsAndroidGuideOpen(true)} />

      {/* Android APK / PWA Guide Modal */}
      <AndroidInstallGuideModal
        isOpen={isAndroidGuideOpen}
        onClose={() => setIsAndroidGuideOpen(false)}
      />
    </div>
  );
}
