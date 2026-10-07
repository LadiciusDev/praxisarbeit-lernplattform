import { Shield, Cpu, Network, FileCode } from 'lucide-react';

export const Footer = () => {

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-zinc-950 py-10 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-medium">
              <Shield className="h-4 w-4 text-zinc-400" />
              <span>Praxisarbeit: Hetzner Cloud Isolation</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              Demonstrator zur Untersuchung von Sicherheits- und Reproduzierbarkeitsanforderungen 
              mittels Infrastructure as Code (Terraform vs. OpenTofu). Testcode wird isoliert ohne Host-Mounts 
              und ohne Netzwerkzugriff ausgeführt.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">Sicherheitsmerkmale</h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-zinc-500" />
                <span>Privates Hetzner-Netzwerk (A4)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-zinc-500" />
                <span>Begrenzte Ressourcen (A5)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-zinc-500" />
                <span>Transparente Exit-Codes (A2)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">Technologien</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              <span className="rounded-md bg-zinc-900 px-2 py-0.5 border border-white/[0.08] text-zinc-300">Terraform</span>
              <span className="rounded-md bg-zinc-900 px-2 py-0.5 border border-white/[0.08] text-zinc-300">OpenTofu</span>
              <span className="rounded-md bg-zinc-900 px-2 py-0.5 border border-white/[0.08] text-zinc-300">Docker</span>
              <span className="rounded-md bg-zinc-900 px-2 py-0.5 border border-white/[0.08] text-zinc-300">Nginx</span>
              <span className="rounded-md bg-zinc-900 px-2 py-0.5 border border-white/[0.08] text-zinc-300">React + Vite</span>
              <span className="rounded-md bg-zinc-900 px-2 py-0.5 border border-white/[0.08] text-zinc-300">Tailwind v4</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>© 2026 Praxisarbeit — Bereitstellung &amp; Evaluation isolierter Cloud-Umgebungen</p>
          <p className="font-mono text-[11px] text-zinc-500">Hetzner Cloud CX22 • Dual-VM Setup</p>
        </div>
      </div>
    </footer>
  );
};
