import { useEffect, useState, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Terminal, PlayCircle, BookOpen, RefreshCw, CheckCircle2, AlertTriangle, WifiOff } from 'lucide-react';
import { checkBackendHealth } from '../../services/api';
import type { BackendHealth } from '../../types/execution';

export const Navbar = () => {
  const [backendStatus, setBackendStatus] = useState<BackendHealth>({
    online: false,
    status: 'checking',
    message: 'Initialisiere Verbindungsprüfung...',
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [checking, setChecking] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const executeHealthCheck = async (isManual = false) => {
    if (isManual) setChecking(true);
    try {
      const res = await checkBackendHealth();
      setBackendStatus(res);
    } catch {
      setBackendStatus({
        online: false,
        status: 'offline',
        message: 'Verbindungsfehler bei /health',
        lastChecked: new Date(),
      });
    } finally {
      if (isManual) setChecking(false);
    }
  };

  useEffect(() => {
    // 1. Sofortige Initialprüfung beim Laden
    executeHealthCheck(true);

    // 2. Regelmäßige Abfrage alle 8 Sekunden ("immer mal wieder prüfen")
    const intervalId = window.setInterval(() => {
      executeHealthCheck(false);
    }, 8000);

    // 3. Sofort erneut prüfen, wenn der Tab wieder in den Fokus rückt
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        executeHealthCheck(false);
      }
    };
    const handleFocus = () => {
      executeHealthCheck(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Klick außerhalb schließt das Status-Modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowStatusModal(false);
      }
    };
    if (showStatusModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusModal]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isActive
      ? 'bg-white/10 text-white border border-white/15'
      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
    }`;

  // Pill-Farbe und Text basierend auf verifiziertem /health Status
  const isFullyConnected = backendStatus.online && backendStatus.status === 'healthy';
  const isDegraded = backendStatus.status === 'degraded';
  const isChecking = backendStatus.status === 'checking' && !backendStatus.lastChecked;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/10 text-white group-hover:border-white/20 transition-colors">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-sm">CodeLab</span>
              <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-white/10">
                Praxisarbeit
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          <NavLink to="/" className={navLinkClass} end>
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Übersicht</span>
          </NavLink>

          <NavLink to="/architektur" className={navLinkClass}>
            <span>Architektur</span>
          </NavLink>

          <div className="h-3.5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {/* Sprache-Direktlinks */}
          <NavLink to="/lernen/python/grundlagen" className={navLinkClass}>
            <span>Python</span>
          </NavLink>

          <NavLink to="/lernen/javascript/grundlagen" className={navLinkClass}>
            <span>JavaScript</span>
          </NavLink>

          <NavLink to="/lernen/java/grundlagen" className={navLinkClass}>
            <span>Java</span>
          </NavLink>

          <div className="h-3.5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          {/* Freier Playground */}
          <NavLink
            to="/playground"
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                ? 'bg-white text-zinc-950 font-semibold'
                : 'border border-white/10 bg-white/[0.04] text-zinc-200 hover:text-white hover:bg-white/[0.08]'
              }`
            }
          >
            <PlayCircle className="h-3.5 w-3.5" />
            <span>Playground</span>
          </NavLink>
        </nav>

        {/* Backend Status Pill mit periodischem /health Check */}
        <div className="relative" ref={modalRef}>
          <button
            onClick={() => setShowStatusModal(!showStatusModal)}
            className="flex items-center gap-2 text-xs font-mono bg-zinc-900/80 border border-white/10 hover:border-white/20 rounded-full px-3 py-1 transition-all text-zinc-300 hover:text-white cursor-pointer"
            title="Klicken für Live-Status des /health Endpoints und Sandbox-Details"
          >
            {/* Status-Indikatorpunkt: Erst grün wenn /health healthy meldet */}
            {isFullyConnected ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </span>
            ) : isDegraded ? (
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            ) : isChecking ? (
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            )}

            {/* Label Desktop */}
            <span className="hidden sm:inline font-medium">
              {isFullyConnected
                ? 'Hetzner: Verbunden'
                : isDegraded
                ? 'Hetzner: Eingeschränkt'
                : isChecking
                ? 'Prüfe Verbindung...'
                : 'Hetzner: Simulation (Offline)'}
            </span>

            {/* Label Mobile */}
            <span className="sm:hidden font-medium">
              {isFullyConnected ? 'Verbunden' : isDegraded ? 'Eingeschränkt' : isChecking ? 'Prüfe' : 'Offline'}
            </span>
          </button>

          {/* Status Details Popover */}
          {showStatusModal && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl z-50 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      isFullyConnected
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isDegraded
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isFullyConnected ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isDegraded ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <WifiOff className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Execution-Backend Health</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Periodischer Check alle 8s</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-slate-300">
                {/* Status-Zusammenfassung */}
                <div className="flex items-center justify-between rounded-lg bg-slate-900/80 p-2.5 border border-slate-800/80">
                  <span className="text-slate-400">/health Status:</span>
                  <span
                    className={`font-semibold flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] ${
                      isFullyConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isDegraded
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isFullyConnected ? 'bg-emerald-400' : isDegraded ? 'bg-amber-400' : 'bg-slate-400'
                      }`}
                    />
                    {isFullyConnected
                      ? 'Healthy (Voll verbunden)'
                      : isDegraded
                      ? 'Degraded (Docker nicht bereit)'
                      : 'Offline (Client-Fallback)'}
                  </span>
                </div>

                {/* Detailfelder */}
                <div className="rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Endpoint:</span>
                    <span className="text-slate-200 truncate max-w-[200px]" title={backendStatus.url}>
                      {backendStatus.url || '/health'}
                    </span>
                  </div>

                  {backendStatus.latencyMs !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">Latenz:</span>
                      <span className="text-emerald-400 font-semibold">{backendStatus.latencyMs} ms</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Docker Sandbox:</span>
                    <span className={backendStatus.dockerAvailable ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                      {backendStatus.dockerAvailable ? 'Einsatzbereit (A5)' : 'Nicht bereit'}
                    </span>
                  </div>

                  {backendStatus.supportedLanguages && backendStatus.supportedLanguages.length > 0 && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-800/60 font-sans">
                      <span className="text-slate-400">Sprachen:</span>
                      <div className="flex items-center gap-1">
                        {backendStatus.supportedLanguages.map((lang: string) => (
                          <span
                            key={lang}
                            className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 text-[10px] font-mono border border-slate-700"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center font-sans">
                    <span className="text-slate-400">Zuletzt geprüft:</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {backendStatus.lastChecked
                        ? backendStatus.lastChecked.toLocaleTimeString()
                        : 'noch nicht'}
                    </span>
                  </div>
                </div>

                {/* Status-Meldung */}
                <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                  {backendStatus.message}
                </p>

                {/* Footer mit Aktualisieren-Button */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {checking ? 'Prüfe /health...' : 'Automatische Prüfung alle 8s'}
                  </span>
                  <button
                    onClick={() => executeHealthCheck(true)}
                    disabled={checking}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-[11px] font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${checking ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>Neu prüfen</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
