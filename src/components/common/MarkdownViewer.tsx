import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const renderInlineFormatted = (text: string) => {
    // Process bold, italic, inline code, and citations
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Pattern for inline code `...`, bold **...**, citation [1], italic *...*
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\[\d+\]|\*[^*]+\*)/g;
    const splitParts = remaining.split(regex);

    return splitParts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px] sm:text-xs border border-slate-700/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={idx} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (/^\[\d+\]$/.test(part)) {
        return (
          <span
            key={idx}
            className="inline-flex items-center justify-center text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/30 px-1 py-0.2 rounded mx-0.5 font-bold cursor-pointer hover:bg-sky-500/20"
            title="Grounded source citation"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Parse lines into logical blocks
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let listBuffer: { type: 'bullet' | 'number'; text: string; num?: string }[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const items = [...listBuffer];
    listBuffer = [];
    blocks.push(
      <ul key={`list-${blocks.length}`} className="space-y-1.5 my-2.5 pl-1">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
            {it.type === 'bullet' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
            ) : (
              <span className="font-mono text-sky-400 font-semibold text-xs shrink-0 mt-0.5">
                {it.num}.
              </span>
            )}
            <span className="leading-relaxed">{renderInlineFormatted(it.text)}</span>
          </li>
        ))}
      </ul>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const fullCode = codeBuffer.join('\n');
        const blockId = `code-${blocks.length}`;
        blocks.push(
          <div
            key={blockId}
            className="relative my-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md font-mono text-xs"
          >
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
              <span className="uppercase tracking-wider font-semibold text-slate-400">
                {codeLang || 'code'}
              </span>
              <button
                onClick={() => copyCode(fullCode, blockId)}
                className="flex items-center gap-1 hover:text-white transition text-[11px]"
              >
                {copiedBlock === blockId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed scrollbar-thin">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = '';
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Horizontal Rule
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flushList();
      blocks.push(
        <hr key={`hr-${blocks.length}`} className="my-4 border-slate-800/80" />
      );
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      flushList();
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          className="text-sm sm:text-base font-bold text-white pt-2 pb-1 border-b border-slate-800/50 flex items-center gap-2"
        >
          <span className="w-1.5 h-3.5 rounded bg-sky-500" />
          <span>{renderInlineFormatted(line.replace('### ', ''))}</span>
        </h3>
      );
      continue;
    }
    if (line.startsWith('#### ')) {
      flushList();
      blocks.push(
        <h4
          key={`h4-${blocks.length}`}
          className="text-xs sm:text-sm font-semibold text-sky-300 pt-2 pb-0.5"
        >
          {renderInlineFormatted(line.replace('#### ', ''))}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      blocks.push(
        <h2
          key={`h2-${blocks.length}`}
          className="text-base sm:text-lg font-extrabold text-white pt-3 pb-1 border-b border-slate-800 flex items-center gap-2"
        >
          <span className="w-2 h-4 rounded bg-gradient-to-b from-sky-400 to-indigo-500" />
          <span>{renderInlineFormatted(line.replace('## ', ''))}</span>
        </h2>
      );
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      blocks.push(
        <h1
          key={`h1-${blocks.length}`}
          className="text-lg sm:text-xl font-black text-white pt-2 pb-1.5"
        >
          {renderInlineFormatted(line.replace('# ', ''))}
        </h1>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="my-2.5 pl-3.5 py-1.5 border-l-2 border-sky-500 bg-sky-950/20 rounded-r-lg text-xs sm:text-sm text-slate-300 italic"
        >
          {renderInlineFormatted(line.replace('> ', ''))}
        </blockquote>
      );
      continue;
    }

    // Lists: Bullet
    if (/^\s*[-*]\s+/.test(line)) {
      const text = line.replace(/^\s*[-*]\s+/, '');
      listBuffer.push({ type: 'bullet', text });
      continue;
    }

    // Lists: Numbered
    const numMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
    if (numMatch) {
      listBuffer.push({ type: 'number', text: numMatch[2], num: numMatch[1] });
      continue;
    }

    // Empty lines flush lists
    if (!line.trim()) {
      flushList();
      continue;
    }

    // Regular Paragraph
    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-1.5">
        {renderInlineFormatted(line)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-1 font-sans ${className}`}>{blocks}</div>;
};
