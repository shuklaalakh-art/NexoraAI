import React, { useState, useEffect, useCallback } from 'react';
import { PresentationDeckData } from '../../types';
import { downloadPptxFile } from '../../services/pptxExporter';
import { fetchAIPresentationDeck } from '../../services/aiOrchestrator';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  Play,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Palette,
  Check,
  Copy,
  ExternalLink,
  Tv,
  Sparkles,
  Volume2,
  X,
  RefreshCw,
} from 'lucide-react';

interface PresentationDeckStudioProps {
  deck: PresentationDeckData;
  prompt: string;
}

export const PresentationDeckStudio: React.FC<PresentationDeckStudioProps> = ({
  deck: initialDeck,
  prompt,
}) => {
  const [deck, setDeck] = useState<PresentationDeckData>(initialDeck);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'cyan' | 'midnight' | 'light'>('dark');
  const [showNotes, setShowNotes] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOutline, setCopiedOutline] = useState(false);

  // Sync when prop updates
  useEffect(() => {
    setDeck(initialDeck);
    setCurrentSlideIdx(0);
  }, [initialDeck]);

  const handleAiRegenerate = async () => {
    setIsAiGenerating(true);
    try {
      const aiDeck = await fetchAIPresentationDeck(prompt, deck.subtitle);
      if (aiDeck && Array.isArray(aiDeck.slides) && aiDeck.slides.length > 0) {
        setDeck(aiDeck);
        setCurrentSlideIdx(0);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.warn('AI deck regeneration error:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const currentSlide = deck.slides[currentSlideIdx] || deck.slides[0];

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentSlideIdx((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlideIdx((prev) => (prev < deck.slides.length - 1 ? prev + 1 : prev));
  }, [deck.slides.length]);

  // Keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isFullScreen]);

  // Real PPTX Download
  const handleDownloadPptx = async () => {
    setIsDownloading(true);
    try {
      await downloadPptxFile({ ...deck, theme: selectedTheme }, deck.title);
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err) {
      console.error('Failed to generate PPTX file:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy shareable link
  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy outline
  const handleCopyOutline = () => {
    const outline = `# ${deck.title}\n${deck.subtitle}\n\n` +
      deck.slides
        .map((s, idx) => `## Slide ${idx + 1}: ${s.title}\n${s.subtitle || ''}\n` +
          (s.bullets ? s.bullets.map(b => `- ${b}`).join('\n') : '') +
          (s.cards ? s.cards.map(c => `### ${c.title}\n${c.desc}`).join('\n\n') : '') +
          (s.speakerNotes ? `\n> Speaker Notes: ${s.speakerNotes}` : '')
        )
        .join('\n\n---\n\n');
    navigator.clipboard.writeText(outline);
    setCopiedOutline(true);
    setTimeout(() => setCopiedOutline(false), 2000);
  };

  // Theme styling configurations
  const themeStyles = {
    dark: {
      canvas: 'bg-slate-950 text-slate-100 border-slate-800',
      slideBg: 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-slate-800/80',
      title: 'text-white',
      accent: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      cardBg: 'bg-slate-900/90 border-slate-800 hover:border-slate-700',
      cardTitle: 'text-white',
      cardDesc: 'text-slate-400',
    },
    cyan: {
      canvas: 'bg-slate-950 text-slate-100 border-slate-800',
      slideBg: 'bg-gradient-to-br from-cyan-950/40 via-slate-950 to-slate-900 border-cyan-500/30',
      title: 'text-white',
      accent: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      cardBg: 'bg-slate-900/80 border-cyan-900/40 hover:border-cyan-500/40',
      cardTitle: 'text-cyan-100',
      cardDesc: 'text-slate-400',
    },
    midnight: {
      canvas: 'bg-slate-950 text-slate-100 border-slate-800',
      slideBg: 'bg-gradient-to-br from-purple-950/30 via-slate-950 to-indigo-950/30 border-purple-500/30',
      title: 'text-white',
      accent: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      cardBg: 'bg-slate-900/80 border-purple-900/40 hover:border-purple-500/40',
      cardTitle: 'text-purple-100',
      cardDesc: 'text-slate-400',
    },
    light: {
      canvas: 'bg-slate-100 text-slate-900 border-slate-300',
      slideBg: 'bg-white border-slate-200 text-slate-900 shadow-xl',
      title: 'text-slate-900',
      accent: 'text-sky-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      cardBg: 'bg-slate-50 border-slate-200 hover:border-slate-300',
      cardTitle: 'text-slate-900',
      cardDesc: 'text-slate-600',
    },
  };

  const currentThemeStyle = themeStyles[selectedTheme];

  return (
    <div className={`w-full space-y-4 ${isFullScreen ? 'fixed inset-0 z-50 p-4 sm:p-8 bg-slate-950 flex flex-col justify-between overflow-y-auto' : ''}`}>
      {/* Studio Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/25 shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Presentation Deck Studio
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-medium">
                {deck.slides.length} Widescreen Slides Ready
              </span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-1">
              {deck.title}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {(['dark', 'cyan', 'midnight', 'light'] as const).map((th) => (
              <button
                key={th}
                onClick={() => setSelectedTheme(th)}
                className={`px-2 py-1 rounded-lg capitalize text-[11px] font-medium transition ${
                  selectedTheme === th
                    ? 'bg-slate-800 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {th}
              </button>
            ))}
          </div>

          {/* Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              showNotes
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle speaker notes for current slide"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notes</span>
          </button>

          {/* Full Screen Slideshow */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition"
            title="Launch Full-Screen Slideshow"
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullScreen ? 'Exit' : 'Present'}</span>
          </button>

          {/* Share Deck Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            title="Share presentation deck"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Share</span>
          </button>

          {/* AI Enhance / Regenerate with Gemini Button */}
          <button
            onClick={handleAiRegenerate}
            disabled={isAiGenerating}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
            title="Generate deep topic-specific slides with Google Gemini"
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isAiGenerating ? 'animate-spin' : ''}`} />
            <span>{isAiGenerating ? 'Generating...' : 'Deepen with AI'}</span>
          </button>

          {/* Primary PPTX Download Button */}
          <button
            onClick={handleDownloadPptx}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-600 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition active:scale-95 disabled:opacity-50"
            title="Download native Microsoft PowerPoint (.pptx) file"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloading ? 'Building PPT...' : 'Download PPTX'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Canvas (16:9 Aspect Ratio Container) */}
      <div className="relative w-full rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300">
        <div
          className={`w-full min-h-[440px] sm:min-h-[500px] p-6 sm:p-10 flex flex-col justify-between relative border ${currentThemeStyle.slideBg}`}
        >
          {/* Slide Top Metadata Bar */}
          <div className="flex items-center justify-between text-xs pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-[11px] uppercase text-slate-400">
                NEXORA INTELLIGENCE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400 truncate max-w-xs">
                {deck.topic}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-black/30 border border-white/10 text-slate-300">
                Slide {currentSlideIdx + 1} of {deck.slides.length}
              </span>
            </div>
          </div>

          {/* Center Slide Body */}
          <div className="py-6 sm:py-8 space-y-6 flex-1 flex flex-col justify-center">
            {/* Slide Badge if present */}
            {currentSlide.badge && (
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${currentThemeStyle.badgeBg}`}
                >
                  <Sparkles className="w-3 h-3" />
                  {currentSlide.badge}
                </span>
              </div>
            )}

            {/* Slide Title */}
            <h2
              className={`font-black tracking-tight leading-tight ${
                currentSlideIdx === 0
                  ? 'text-2xl sm:text-4xl lg:text-5xl max-w-4xl'
                  : 'text-xl sm:text-3xl max-w-3xl'
              } ${currentThemeStyle.title}`}
            >
              {currentSlide.title}
            </h2>

            {/* Slide Subtitle */}
            {currentSlide.subtitle && (
              <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
                {currentSlide.subtitle}
              </p>
            )}

            {/* Render Cards Grid if cards exist */}
            {currentSlide.cards && currentSlide.cards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {currentSlide.cards.map((card, cIdx) => (
                  <div
                    key={cIdx}
                    className={`p-5 rounded-xl border transition-all duration-200 space-y-2.5 ${currentThemeStyle.cardBg}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{card.iconText || '📌'}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        0{cIdx + 1}
                      </span>
                    </div>
                    <h4 className={`font-bold text-sm leading-snug ${currentThemeStyle.cardTitle}`}>
                      {card.title}
                    </h4>
                    <p className={`text-xs leading-relaxed ${currentThemeStyle.cardDesc}`}>
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Render Bullet Points if bullets exist */}
            {currentSlide.bullets && currentSlide.bullets.length > 0 && (
              <div className="space-y-3 pt-2">
                {currentSlide.bullets.map((b, bIdx) => (
                  <div
                    key={bIdx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-black/20 border border-white/5"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400 mt-2 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
            <span>Author: Alakh Shukla • Presentation Mode</span>
            <span className="font-mono text-[11px]">16:9 HD Widescreen</span>
          </div>
        </div>

        {/* Slide Bottom Navigator Controls */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIdx === 0}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
              title="Previous slide (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-slate-400 px-2">
              <strong className="text-white">{currentSlideIdx + 1}</strong> / {deck.slides.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentSlideIdx === deck.slides.length - 1}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
              title="Next slide (Right Arrow or Space)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Thumbnails Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-md sm:max-w-xl py-1 px-2 scrollbar-none">
            {deck.slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIdx(idx)}
                className={`h-8 px-2.5 rounded-md text-[11px] font-mono whitespace-nowrap border transition ${
                  currentSlideIdx === idx
                    ? 'bg-sky-500 text-white border-sky-400 font-bold shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={s.title}
              >
                {idx + 1}. {s.title.slice(0, 12)}...
              </button>
            ))}
          </div>

          {/* Slide Mode Helper */}
          <div className="text-[11px] text-slate-400 hidden lg:flex items-center gap-1">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px]">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px]">
              →
            </kbd>
            <span>keys to navigate</span>
          </div>
        </div>
      </div>

      {/* Speaker Notes Drawer if toggled */}
      {showNotes && (
        <div className="p-4 rounded-xl bg-slate-900/95 border border-sky-500/30 space-y-2 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Speaker Notes for Slide {currentSlideIdx + 1}</span>
            </div>
            <button
              onClick={() => setShowNotes(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-3 rounded-lg border border-slate-800">
            {currentSlide.speakerNotes || 'No custom notes provided for this slide.'}
          </p>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-white text-base">Share Presentation Deck</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Share link */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Presentation Link:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Copy Markdown Outline */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Copy Slide Deck Outline (Markdown):</label>
                <button
                  onClick={handleCopyOutline}
                  className="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  {copiedOutline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedOutline ? 'Copied Outline to Clipboard' : 'Copy Full Slide Deck Transcript'}</span>
                </button>
              </div>

              {/* Native PPT Download from Modal */}
              <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-2">
                <h4 className="font-bold text-pink-300 text-xs">Need Offline Slides?</h4>
                <p className="text-[11px] text-slate-400">
                  Export this deck as a PowerPoint (.pptx) file with 16:9 widescreen layout and ready-to-present cards.
                </p>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    handleDownloadPptx();
                  }}
                  className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-lg shadow-md transition flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .PPTX Now</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
