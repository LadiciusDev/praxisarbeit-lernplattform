import { ShieldCheck, Server, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ThesisBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/40 p-6 md:p-8 backdrop-blur-md shadow-2xl">
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Wissenschaftliche Praxisarbeit • Hetzner Cloud
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Evaluation von Terraform &amp; OpenTofu zur sicheren Bereitstellung isolierter Ausführungsumgebungen
          </h2>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Diese Lernplattform fungiert als interaktiver Arbeitsnachweis. Ausgeführter Code wird nicht auf dem Webserver,
            sondern in kurzlebigen, gehärteten Docker-Containern auf einer isolierten, privaten Hetzner-Ausführungs-VM verarbeitet.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Server className="h-4 w-4 text-cyan-400" />
              <span>Zwei-VM-Architektur (Öffentlich &amp; Privat)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Isolierte Container-Sandbox (--network none)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
          <Link
            to="/playground"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95"
          >
            <span>Sandbox testen</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/architektur"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <span>Architektur-Info</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
