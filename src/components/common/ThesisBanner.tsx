import { Server, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ThesisBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 md:p-8 backdrop-blur-md">
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Praxisarbeit • Hetzner Cloud Zwei-VM-Setup</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
            Evaluation von Terraform &amp; OpenTofu zur sicheren Bereitstellung isolierter Ausführungsumgebungen
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Interaktive Testplattform zur Verifikation der Sicherheits- und Isolationsanforderungen.
            Ausgeführter Programmcode läuft in ephemeren, gehärteten Docker-Containern auf einer netzwerkisolierten Ausführungs-VM.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-zinc-300" />
              <span>Plattform: 10.10.1.10</span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-zinc-300" />
              <span>Execution: 10.10.1.20</span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">A4 &amp; A5:</span>
              <span>--network none (512 MB)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
          <Link
            to="/playground"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-xs"
          >
            <span>Sandbox testen</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/architektur"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span>Architektur &amp; Kriterien</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

