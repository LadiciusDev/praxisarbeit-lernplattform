import { useState, useEffect, type KeyboardEvent } from 'react';
import Editor from '@monaco-editor/react';
import type { ExecuteResponse, ExecutionStatus, SupportedLanguage } from '../../types/execution';
import { executeCode } from '../../services/api';
import { LanguageSelect } from './LanguageSelect';
import { TerminalOutput } from './TerminalOutput';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

interface CodeRunnerProps {
  language: SupportedLanguage;
  initialCode: string;
  allowLanguageChange?: boolean;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  title?: string;
}

export const CodeRunner = ({
  language,
  initialCode,
  allowLanguageChange = false,
  onLanguageChange,
  title,
}: CodeRunnerProps) => {

  const [code, setCode] = useState<string>(initialCode);
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [result, setResult] = useState<ExecuteResponse | null>(null);

  // Aktualisiert den Code, falls sich initialCode durch Lektionswechsel ändert
  useEffect(() => {
    setCode(initialCode);
    setResult(null);
    setStatus('idle');
  }, [initialCode]);

  const handleRun = async () => {
    if (status === 'running') return;
    setStatus('running');

    try {
      const response = await executeCode({
        language,
        code,
      });
      setResult(response);
      setStatus(response.exitCode === 0 ? 'success' : 'error');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setResult({
        jobId: 'err-client',
        stdout: '',
        stderr: `Client-Ausführungsfehler: ${errorMsg}`,
        exitCode: 1,
        executionTimeMs: 0,
        timestamp: new Date().toISOString(),
      });
      setStatus('error');
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setResult(null);
    setStatus('idle');
  };

  // Tastenkürzel Cmd+Enter / Ctrl+Enter zum schnellen Ausführen
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {

      e.preventDefault();
      handleRun();
    }
  };

  // Monaco Sprache zuweisen
  const monacoLanguage = language === 'python' ? 'python' : language === 'javascript' ? 'javascript' : 'java';

  return (
    <div className="flex flex-col gap-4 w-full" onKeyDown={handleKeyDown}>
      {/* Editor Container */}
      <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800/90 bg-slate-950/70 px-4 py-3 gap-3">
          <div className="flex items-center gap-3">
            {allowLanguageChange ? (
              <LanguageSelect
                value={language}
                disabled={status === 'running'}
                onChange={(lang) => onLanguageChange && onLanguageChange(lang)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 font-mono">
                  {title || `${language.toUpperCase()} Editor`}
                </span>
                <Badge variant={language === 'python' ? 'sky' : language === 'javascript' ? 'amber' : 'rose'}>
                  {language}
                </Badge>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>IntelliSense aktiv</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={status === 'running' || code === initialCode}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Code auf Standard zurücksetzen"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Zurücksetzen</span>
            </button>

            <button
              onClick={handleRun}
              disabled={status === 'running'}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'running' ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Wird ausgeführt...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Code ausführen</span>
                  <span className="hidden md:inline text-[10px] bg-white/20 px-1 py-0.2 rounded font-mono">
                    ⌘↵
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Monaco Editor Canvas */}
        <div className="h-[340px] sm:h-[380px] w-full bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={monacoLanguage}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            loading={
              <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                Lade Monaco IntelliSense Editor...
              </div>
            }
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              tabSize: language === 'python' ? 4 : 2,
              lineNumbersMinChars: 3,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              formatOnPaste: true,
              suggestOnTriggerCharacters: true,
              wordWrap: 'on',
            }}
          />
        </div>
      </div>

      {/* Terminal Konsole */}
      <TerminalOutput
        status={status}
        result={result}
        onClear={() => {
          setResult(null);
          setStatus('idle');
        }}
      />
    </div>
  );
};
