import { useState } from 'react';
import type { ExecuteResponse, ExecutionStatus } from '../../types/execution';
import { Terminal, AlertCircle, CheckCircle2, Clock, Hash, Copy, Check, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';

interface TerminalOutputProps {
  status: ExecutionStatus;
  result: ExecuteResponse | null;
  onClear: () => void;
}

export const TerminalOutput = ({ status, result, onClear }: TerminalOutputProps) => {

  const [activeTab, setActiveTab] = useState<'console' | 'meta'>('console');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    const text = result.stderr ? `${result.stdout}\n[STDERR]\n${result.stderr}` : result.stdout;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = result?.exitCode === 0;

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* Mac-Style Dot Indicators */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'console'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('meta')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'meta'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hash className="h-3.5 w-3.5" />
            <span>Job-Metadaten</span>
          </button>
        </div>

        {/* Right Info Badges */}
        <div className="flex items-center gap-2">
          {result && (
            <>
              {isSuccess ? (
                <Badge variant="emerald" size="sm">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Exit 0</span>
                </Badge>
              ) : (
                <Badge variant="rose" size="sm">
                  <AlertCircle className="h-3 w-3" />
                  <span>Exit {result.exitCode}</span>
                </Badge>
              )}

              <Badge variant="slate" size="sm" className="font-mono">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{result.executionTimeMs} ms</span>
              </Badge>

              {result.mocked && (
                <Badge variant="amber" size="sm">
                  Mock
                </Badge>
              )}

              <button
                onClick={handleCopy}
                title="Ausgabe kopieren"
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>

              <button
                onClick={onClear}
                title="Konsole leeren"
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="flex-1 p-4 font-mono text-xs overflow-auto bg-slate-950/90 leading-relaxed min-h-[180px]">
        {status === 'running' && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 py-10">
            <div className="relative">
              <div className="h-8 w-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            </div>
            <div className="flex items-center gap-2 text-cyan-300 animate-pulse">
              <span>Starte isolierten Container auf Ausführungs-VM...</span>
            </div>
            <span className="text-[11px] text-slate-500 font-sans">
              Limits: 128 MB RAM • 0.5 CPU • Network: None
            </span>
          </div>
        )}

        {status !== 'running' && !result && (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2 py-10 font-sans">
            <Terminal className="h-7 w-7 text-slate-700" />
            <p className="text-xs">Noch kein Code ausgeführt.</p>
            <p className="text-[11px] text-slate-600">
              Klicke oben auf <strong className="text-slate-400">„Code ausführen“</strong>, um den Job zu starten.
            </p>
          </div>
        )}

        {status !== 'running' && result && activeTab === 'console' && (
          <div className="space-y-3">
            {/* Standard Output (stdout) */}
            {result.stdout && (
              <div className="text-slate-100 whitespace-pre-wrap break-all">
                {result.stdout}
              </div>
            )}

            {/* Standard Error (stderr) */}
            {result.stderr && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-300 whitespace-pre-wrap break-all">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Fehlerausgabe (stderr):</span>
                </div>
                {result.stderr}
              </div>
            )}

            {!result.stdout && !result.stderr && (
              <div className="text-slate-500 italic">
                (Keine Konsolenausgabe erzeugt – Programm wurde erfolgreich mit Exit-Code {result.exitCode} beendet)
              </div>
            )}
          </div>
        )}

        {status !== 'running' && result && activeTab === 'meta' && (
          <div className="space-y-2 text-slate-300">
            <div className="text-slate-400 font-semibold mb-2">Job-Audit Protokoll (Anforderung A6):</div>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500">Job-ID:</span>{' '}
                <span className="text-cyan-400 font-semibold">{result.jobId}</span>
              </div>
              <div>
                <span className="text-slate-500">Zeitpunkt:</span>{' '}
                <span className="text-slate-300">{new Date(result.timestamp).toLocaleTimeString()}</span>
              </div>
              <div>
                <span className="text-slate-500">Ausführungsdauer:</span>{' '}
                <span className="text-emerald-400">{result.executionTimeMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500">Exit-Code:</span>{' '}
                <span className={result.exitCode === 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {result.exitCode}
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="text-slate-500">Sandbox:</span> Docker Engine • Non-Root • Restricted Network
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
