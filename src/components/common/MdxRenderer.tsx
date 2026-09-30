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
    <div className={`prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed text-sm ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white tracking-tight mt-6 mb-3 border-b border-slate-800 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-5 mb-2.5 flex items-center gap-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-cyan-300 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-slate-300 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 mb-3 space-y-1 text-slate-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 mb-3 space-y-1 text-slate-300">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse bg-slate-900/50">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-800/80 text-slate-200 border-b border-slate-700">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-slate-800">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-slate-800/40 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-3.5 py-2.5 font-semibold text-slate-200">{children}</th>,
          td: ({ children }) => <td className="px-3.5 py-2.5 text-slate-300">{children}</td>,
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-cyan-300 border border-slate-700/60" {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock code={String(children).replace(/\n$/, '')} className={className} />;
          },
          blockquote: ({ children }) => {
            return (
              <blockquote className="my-3 rounded-xl border-l-4 border-cyan-500 bg-slate-900/70 p-3.5 text-xs text-slate-300 italic not-italic">
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
    <div className="relative group my-3 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-3 py-1.5 text-[11px] text-slate-400">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
          title="Code kopieren"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Kopiert' : 'Kopieren'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};
