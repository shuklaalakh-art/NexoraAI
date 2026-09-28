import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { NexoraLogo } from '../brand/NexoraLogo';
import {
  Sparkles,
  Command,
  FolderKanban,
  BookmarkCheck,
  Cpu,
  BarChart3,
  SlidersHorizontal,
  Layers,
  Smartphone,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAndroidGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenAndroidGuide,
}) => {
  const navItems = [
    { id: 'command', label: 'Command Center', icon: Command },
    { id: 'workspace', label: 'Workspace', icon: FolderKanban },
    { id: 'prompts', label: 'Prompts', icon: BookmarkCheck },
    { id: 'connections', label: 'Providers', icon: Cpu },
    { id: 'usage', label: 'Usage & Costs', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div
          onClick={() => onSelectTab('command')}
          className="flex items-center cursor-pointer select-none group py-1"
        >
          <NexoraLogo size="md" showSubtitle={true} />
        </div>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 p-1 rounded-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Android install + Quick Action */}
        <div className="flex items-center gap-2.5">
          {/* Dedicated Google Play Store & Android APK Bundler Hub */}
          <button
            onClick={onOpenAndroidGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition active:scale-95 shadow-sm"
            title="Bundle into APK & Publish on Google Play Store (TWA / AAB Hub)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Play Store &amp; APK</span>
          </button>

          <PWAInstallButton />

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              AS
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-slate-950/60 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition ${
                isActive
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
