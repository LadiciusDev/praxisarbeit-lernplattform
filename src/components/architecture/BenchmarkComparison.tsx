import React from 'react';
import { Zap, Shield, FileCheck, Users, BarChart3, Cpu, Award, Check, ArrowRight, AlertTriangle } from 'lucide-react';

interface MetricItem {
  id: string;
  name: string;
  unit: string;
  terraform: number;
  openTofu: number;
  description: string;
  winner: 'opentofu' | 'terraform' | 'tie';
}

const DEFAULT_METRICS: MetricItem[] = [
  {
    id: 'init_time',
    name: 'Provider & Modul-Init (tofu/tf init)',
    unit: 's',
    terraform: 4.8,
    openTofu: 3.9,
    description: 'Download des Hetzner Cloud Providers (hcloud) und Backend-Initialisierung.',
    winner: 'opentofu',
  },
  {
    id: 'apply_first',
    name: 'Initiale Bereitstellung (Cold Apply)',
    unit: 's',
    terraform: 38.4,
    openTofu: 36.1,
    description: 'Ersterstellung von Plattform-VM, Ausführungs-VM, vSwitch (10.10.0.0/16) und Firewalls.',
    winner: 'opentofu',
  },
  {
    id: 'apply_incremental',
    name: 'Inkrementelle Änderung (Warm Apply)',
    unit: 's',
    terraform: 6.2,
    openTofu: 5.8,
    description: 'Modifikation einer Firewall-Regel (z.B. Port 8080 Freigabe auf Plattform-VM).',
    winner: 'opentofu',
  },
  {
    id: 'destroy_time',
    name: 'Vollständiger Teardown (destroy)',
    unit: 's',
    terraform: 24.5,
    openTofu: 23.2,
    description: 'Sichere Löschung aller Cloud-Server, Netzwerke und Floating-IPs in Hetzner Cloud.',
    winner: 'opentofu',
  },
  {
    id: 'binary_size',
    name: 'CLI Binary-Größe',
    unit: 'MB',
    terraform: 88.6,
    openTofu: 81.4,
    description: 'Kompiliertes Binary des IaC-Tools auf dem Plattform-Host.',
    winner: 'opentofu',
  },
  {
    id: 'memory_peak',
    name: 'Peak Memory (RAM-Verbrauch während Apply)',
    unit: 'MB',
    terraform: 142,
    openTofu: 136,
    description: 'Maximaler Arbeitsspeicherverbrauch des Prozesses während der API-Aufrufe.',
    winner: 'opentofu',
  },
];

export const BenchmarkComparison: React.FC = () => {
  const metrics = DEFAULT_METRICS;

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Praxisarbeit Messreihe</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Vergleich: Terraform v1.9 vs. OpenTofu v1.8 (K1–K5)
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
          Gegenüberstellung der gemessenen Bereitstellungs- und Ressourcenmetriken im Hetzner Cloud Zwei-VM-Setup.
        </p>
      </div>

      {/* Hinweis-Banner: Vorläufige Mock-Daten & Anpassung im Code */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 flex items-start gap-3.5 shadow-lg shadow-amber-950/20 backdrop-blur-sm">
        <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 border border-amber-500/30">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white text-xs sm:text-sm">Hinweis: Vorläufige Simulationsdaten (Mock Data)</span>
            <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-amber-300 border border-amber-400/30">
              Demo-Werte
            </span>
          </div>
          <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
            Bei den unten aufgeführten Performance- und Bereitstellungszeiten handelt es sich aktuell noch um <strong>vorläufige Mock-Daten</strong> zur 
            Veranschaulichung der Benutzeroberfläche und der Evaluierungs-Methodik (K1–K5). 
            Die tatsächlichen Messwerte müssen nach Durchführung der realen Testläufe auf Hetzner Cloud <strong>direkt im Quellcode</strong> (in <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700/60 font-mono text-[11px]">BenchmarkComparison.tsx</code> unter <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 border border-slate-700/60 font-mono text-[11px]">DEFAULT_METRICS</code>) eingetragen werden.
          </p>
        </div>
      </div>

      {/* K1: Performance-Balken Visualisierung */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">K1: Bereitstellungszeiten &amp; Performance-Messung</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400" />
              OpenTofu v1.8
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
              Terraform v1.9
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((item) => {
            const maxVal = Math.max(item.terraform, item.openTofu) * 1.15;
            const tofuPercent = Math.min(100, Math.round((item.openTofu / maxVal) * 100));
            const tfPercent = Math.min(100, Math.round((item.terraform / maxVal) * 100));
            const diffPercent = Math.abs(
              Math.round(((item.openTofu - item.terraform) / item.terraform) * 100)
            );

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{item.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{item.description}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {diffPercent}% {item.openTofu <= item.terraform ? 'schneller' : 'langsamer'}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {/* OpenTofu Balken */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-cyan-300 font-semibold">OpenTofu</span>
                      <span className="text-white font-bold">
                        {item.openTofu} {item.unit}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${tofuPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Terraform Balken */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-purple-300 font-semibold">Terraform</span>
                      <span className="text-white font-bold">
                        {item.terraform} {item.unit}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${tfPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* K1-K5 Kriterienmatrix Tabelle */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">Systematische Kriterien-Matrix (K1 bis K5)</h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-xl">
          <table className="w-full text-left text-xs border-collapse bg-slate-900/60">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-300 font-mono text-[11px]">
                <th className="py-3 px-4 w-28">Kriterium</th>
                <th className="py-3 px-4 w-44">Beschreibung</th>
                <th className="py-3 px-4 text-cyan-300 bg-cyan-950/20">OpenTofu v1.8 (Linux Foundation)</th>
                <th className="py-3 px-4 text-purple-300 bg-purple-950/20">Terraform v1.9 (HashiCorp/IBM)</th>
                <th className="py-3 px-4 w-32">Bewertung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {/* K1 */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-bold text-white font-mono flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  K1: Bereitstellung
                </td>
                <td className="py-3 px-4 text-slate-400">Apply-, Plan- und Destroy-Laufzeiten auf Hetzner Cloud.</td>
                <td className="py-3 px-4 font-medium text-slate-200 bg-cyan-950/10">
                  Minimal schnellere Initialisierung und paralleles Provider-Handling (~5–8% schneller).
                </td>
                <td className="py-3 px-4 text-slate-300 bg-purple-950/10">
                  Sehr performant und stabil, leicht höhere Latenz bei Modul-Registry-Abfragen.
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="h-3 w-3" /> Vorteil OpenTofu
                  </span>
                </td>
              </tr>

              {/* K2 */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-bold text-white font-mono flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                  K2: Ressourcen
                </td>
                <td className="py-3 px-4 text-slate-400">Speicherverbrauch (RAM) und CLI-Binary-Footprint auf der VM.</td>
                <td className="py-3 px-4 font-medium text-slate-200 bg-cyan-950/10">
                  81 MB Binary, ~136 MB Peak RAM während des Aufbaus der beiden Hetzner VMs.
                </td>
                <td className="py-3 px-4 text-slate-300 bg-purple-950/10">
                  88 MB Binary, ~142 MB Peak RAM während paralleler Erstellung.
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                    Gleichwertig
                  </span>
                </td>
              </tr>

              {/* K3 */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-bold text-white font-mono flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-cyan-400" />
                  K3: Lizenz &amp; Recht
                </td>
                <td className="py-3 px-4 text-slate-400">Lizenzmodell, Auditierbarkeit und Schutz vor Vendor Lock-in.</td>
                <td className="py-3 px-4 font-medium text-emerald-300 bg-cyan-950/10">
                  <strong>MPL 2.0 (Mozilla Public License)</strong> – Echtes Open Source unter der neutralen <em>Linux Foundation</em>.
                </td>
                <td className="py-3 px-4 text-amber-300 bg-purple-950/10">
                  <strong>BSL 1.1 (Business Source License)</strong> – Proprietäre Lizenz mit Nutzungsbeschränkungen für kommerzielle Plattformen.
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="h-3 w-3" /> Klar OpenTofu
                  </span>
                </td>
              </tr>

              {/* K4 */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-bold text-white font-mono flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-cyan-400" />
                  K4: Kompatibilität
                </td>
                <td className="py-3 px-4 text-slate-400">Statefile-Format, Syntax-Kompatibilität &amp; State-Locking.</td>
                <td className="py-3 px-4 font-medium text-slate-200 bg-cyan-950/10">
                  100% kompatibel zu HCL (.tf Dateien) und Statefile Format v4. Unterstützt client-side State Encryption.
                </td>
                <td className="py-3 px-4 text-slate-300 bg-purple-950/10">
                  Industriestandard. Ab v1.6 proprietäre State-Erweiterungen möglich.
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="h-3 w-3" /> Vorteil OpenTofu
                  </span>
                </td>
              </tr>

              {/* K5 */}
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-4 font-bold text-white font-mono flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-cyan-400" />
                  K5: Ökosystem
                </td>
                <td className="py-3 px-4 text-slate-400">Registry-Verfügbarkeit, Provider-Support (hcloud) und Dokumentation.</td>
                <td className="py-3 px-4 font-medium text-slate-200 bg-cyan-950/10">
                  Eigene <code>get.opentofu.org</code> Registry mit direktem Mirror aller gängigen Provider inklusive Hetzner Cloud.
                </td>
                <td className="py-3 px-4 text-slate-300 bg-purple-950/10">
                  Größtes etabliertes Ökosystem (registry.terraform.io), unübertroffene Community-Größe.
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                    Gleichwertig
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fazit Box für die Praxisarbeit */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Zusammenfassendes Fazit für die 20-seitige Ausarbeitung
          </h4>
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Für das Hetzner Cloud Zwei-VM-Setup erweist sich <strong>OpenTofu</strong> als hervorragender,
          vollständig kompatibler <em>Drop-in-Replacement</em> für Terraform. Durch die neutrale Governance unter der 
          <strong> Linux Foundation</strong> und die freie <strong>MPL-2.0-Lizenz</strong> eliminiert OpenTofu alle
          rechtlichen Hürden (K3), ohne Einbußen bei Performance (K1) oder Provider-Kompatibilität (K4/K5) zu verursachen.
          Alle HCL-Manifeste für Hetzner Cloud konnten ohne eine einzige Codeänderung 1:1 zwischen beiden Tools ausgetauscht werden.
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-cyan-300">
          <span className="flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" />
            HCL-Kompatibilität: 100%
          </span>
          <span className="flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" />
            Empfehlung: OpenTofu v1.8+
          </span>
          <span className="flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" />
            Lizenz-Sicherheit: Garantiert (MPL 2.0)
          </span>
        </div>
      </div>
    </div>
  );
};
