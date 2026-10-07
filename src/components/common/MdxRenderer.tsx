import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { MermaidViewer } from './MermaidViewer';



interface MdxRendererProps {
  content: string;
  className?: string;
}

export const MdxRenderer: React.FC<MdxRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-semibold text-white tracking-tight mt-6 mb-3 border-b border-white/[0.08] pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-white tracking-tight mt-5 mb-2.5 flex items-center gap-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-zinc-200 mt-4 mb-2 uppercase tracking-wide font-mono">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-zinc-300 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 mb-3 space-y-1.5 text-zinc-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 mb-3 space-y-1.5 text-zinc-300">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-white/[0.08]">
              <table className="w-full text-left text-xs border-collapse bg-zinc-950/60">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-zinc-900/90 text-zinc-300 border-b border-white/[0.08] font-mono text-[11px]">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-white/[0.04]">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-3.5 py-2.5 font-semibold text-zinc-200">{children}</th>,
          td: ({ children }) => <td className="px-3.5 py-2.5 text-zinc-300 leading-relaxed">{children}</td>,
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-xs text-zinc-200 border border-white/10" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock code={String(children).replace(/\n$/, '')} className={className} />;
          },
          blockquote: ({ children }) => {
            return (
              <blockquote className="my-3 rounded-xl border-l-2 border-white/30 bg-zinc-900/40 p-3.5 text-xs text-zinc-300">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; className?: string }> = ({ code, className }) => {
  const [copied, setCopied] = useState(false);
  const language = className ? className.replace(/language-/, '') : '';

  if (language === 'mermaid') {
    return (
      <div className="my-5 not-prose">
        <MermaidViewer chart={code} title="Ablauf- und Architektur-Diagramm" defaultZoom={1} defaultSize="xl" />
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl border border-white/[0.08] bg-zinc-950 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/60 px-3 py-1.5 text-[11px] text-zinc-400">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          title="Code kopieren"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Kopiert' : 'Kopieren'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};
