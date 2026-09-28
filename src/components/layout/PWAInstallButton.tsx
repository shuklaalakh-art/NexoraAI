import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Smartphone, Download } from 'lucide-react';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallButton: React.FC<{ variant?: 'compact' | 'full' }> = ({
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  // Still allow user to view instructions even if running standalone or waiting for prompt
  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-medium transition active:scale-95 group shadow-sm"
        title="Install NEXORA AI on Android or Desktop as a native app"
      >
        <Smartphone className="w-3.5 h-3.5 group-hover:animate-bounce" />
        <span className="hidden sm:inline">
          {isInstalled ? 'App Installed' : 'Install on Android'}
        </span>
        <span className="sm:hidden">Install</span>
        {isInstallable && (
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
        )}
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
