import { Link } from 'react-router-dom';
import { ThesisBanner } from '../components/common/ThesisBanner';
import { LANGUAGES_DATA } from '../data/lessonsData';
import {
  ArrowRight,
  BarChart3,
  GitBranch,
  CheckCircle2,
  Terminal,
  FileCode,
  BookOpen,
  TrendingDown,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const HomePage = () => {
  const languageList = Object.values(LANGUAGES_DATA);

  const requirementsList = [
    { code: 'A1', title: 'Zwei-VM-Architektur', desc: 'Physische Trennung von Web/API-Plattform und isolierter Ausführungs-VM über privaten Hetzner vSwitch.' },
    { code: 'A2', title: 'Ausführungstransparenz', desc: 'Vollständige Erfassung von stdout, stderr, numerischem Exit-Code und Ausführungszeit in Millisekunden.' },
    { code: 'A3', title: 'Multi-Sprachen-Support', desc: 'Modulare Sandbox-Ausführung von Python 3.11, OpenJDK 21 und JavaScript (Node.js 20).' },
    { code: 'A4', title: 'Netzwerk-Isolation', desc: 'Ausführungs-VM ohne Public IPv4/IPv6; Ingress ausschließlich über 10.10.1.10 auf Port 8080 autorisiert.' },
    { code: 'A5', title: 'Container-Hardening', desc: 'Ephemere Docker-Sandbox mit --network none, 512 MB RAM, 1 vCPU, Non-Root-User (1000:1000) & 10s Timeout.' },
    { code: 'A6', title: 'Fehlerprotokollierung', desc: 'Verifikation von Laufzeitfehlern (Exceptions, SyntaxError, ZeroDivision) ohne Speicherung von Code in Logs.' },
    { code: 'A7', title: 'Reproduzierbare IaC', desc: 'Automatisierter Lebenszyklus (init, plan, apply, destroy) identisch reproduzierbar mit Terraform & OpenTofu.' },
  ];

  const workflowSteps = [
    { step: '01', title: 'HCL-Manifeste', desc: 'Definition von VMs, vSwitch, Firewalls & SSH-Keys' },
    { step: '02', title: 'Init & Download', desc: 'tofu/tf init lädt Hetzner Provider (hcloud)' },
    { step: '03', title: 'Plan & Provisioning', desc: 'Paralleles Deployment beider Server im RZ Falkenstein' },
    { step: '04', title: 'Netzwerk-Routing', desc: 'Privater vSwitch (10.10.1.0/24) ohne NAT zur Außenwelt' },
    { step: '05', title: 'Plattform-Start', desc: 'Nginx, React Web-App und API-Gateway auf Port 8080' },
    { step: '06', title: 'Code-Übermittlung', desc: 'Sichere interne REST-Anfrage an Daemon auf 10.10.1.20' },
    { step: '07', title: 'Ephemere Sandbox', desc: 'Ad-hoc Container-Start, Codeausführung in max. 10s' },
    { step: '08', title: 'Metrik-Rückgabe', desc: 'JSON-Payload mit stdout, stderr, ms & ExitCode an User' },
    { step: '09', title: 'K1–K5 Evaluierung', desc: 'Vergleich von Speed, Ressourcen, Lizenz & State v4' },
    { step: '10', title: 'Teardown (destroy)', desc: 'Rückstandslose Löschung aller Cloud-Ressourcen' },
  ];

  return (
    <div className="space-y-12">
      {/* Thesis Header Banner */}
      <ThesisBanner />

      {/* Wissenschaftliche Kern-Erkenntnisse (Executive Summary für Prüfer) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Empirische Kernergebnisse der Praxisarbeit</span>
          </div>
          <Link
            to="/architektur?tab=benchmarks"
            className="text-xs font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Alle BSD time -l Messdaten</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Result 1: Speed */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">K1 • Bereitstellung</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <TrendingDown className="h-3 w-3" />
                -39,4% Dauer
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">2.88 s</span>
              <span className="text-xs font-mono text-zinc-500">vs. 4.75 s (Terraform)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              OpenTofu v1.12.6 initialisiert Provider und Module signifikant schneller durch optimierte Registry-Parallelsitzungen.
            </p>
          </div>

          {/* Result 2: Memory */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">K2 • Ressourcen</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <TrendingDown className="h-3 w-3" />
                -8,3% RAM
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">77.5 MB</span>
              <span className="text-xs font-mono text-zinc-500">vs. 84.6 MB (Terraform)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Messbar reduzierter Peak Resident Set Size (RSS) Footprint auf der Hetzner VM während paralleler Cloud-Operationen.
            </p>
          </div>

          {/* Result 3: State Encryption & License */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">K3 &amp; K4 • Lizenz &amp; Schutz</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                <ShieldCheck className="h-3 w-3" />
                MPL 2.0 + Krypto
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">Nativ frei</span>
              <span className="text-xs font-mono text-zinc-500">vs. BSL 1.1 / Enterprise</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Client-Side AES-GCM State Encryption ohne Mehrkosten; vollständige Rechtssicherheit unter neutraler Linux Foundation Governance.
            </p>
          </div>
        </div>
      </section>

      {/* Quick-Access Kacheln zur Praxisarbeit */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Link
          to="/architektur?tab=diagram"
          className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4.5 backdrop-blur-sm hover:border-white/20 hover:bg-zinc-900/70 transition-all"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/10 group-hover:text-white transition-colors">
                <GitBranch className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase">Topologie</span>
            </div>
            <h3 className="font-semibold text-white text-sm">
              Zwei-VM-Setup
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Interaktives Flowchart der Hetzner Cloud VMs mit Zoom &amp; Multiformat-Export.
            </p>
          </div>
          <div className="pt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
            <span>Diagramm öffnen</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/architektur?tab=benchmarks"
          className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4.5 backdrop-blur-sm hover:border-white/20 hover:bg-zinc-900/70 transition-all"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/10 group-hover:text-white transition-colors">
                <BarChart3 className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase">Evaluation</span>
            </div>
            <h3 className="font-semibold text-white text-sm">
              Benchmarks (K1–K5)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Gemessene Bereitstellungszeiten, RAM-Footprints &amp; State-Verschlüsselung.
            </p>
          </div>
          <div className="pt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
            <span>Messwerte ansehen</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/playground"
          className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4.5 backdrop-blur-sm hover:border-white/20 hover:bg-zinc-900/70 transition-all"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/10 group-hover:text-white transition-colors">
                <Terminal className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase">Live Sandbox</span>
            </div>
            <h3 className="font-semibold text-white text-sm">
              Code-Playground
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Monaco Editor für Python, Java und JS mit Ad-hoc Container-Ausführung.
            </p>
          </div>
          <div className="pt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
            <span>Playground starten</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/architektur?tab=docs"
          className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-zinc-900/40 p-4.5 backdrop-blur-sm hover:border-white/20 hover:bg-zinc-900/70 transition-all"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-white/[0.04] text-zinc-300 border border-white/10 group-hover:text-white transition-colors">
                <FileCode className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase">Dokumentation</span>
            </div>
            <h3 className="font-semibold text-white text-sm">
              Spezifikation (A1–A7)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Vollständige Anforderungsdokumentation, Port-Matrix und Versuchszyklus.
            </p>
          </div>
          <div className="pt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
            <span>Spezifikation lesen</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Praktischer Versuchsablauf (10 Schritte Pipeline) */}
      <section className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 md:p-8 space-y-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
              <span>Experimenteller Versuchsablauf</span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              10-stufiger Evaluierungszyklus
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Vollständiger Lebenszyklus von HCL-Manifesten über Cloud-Init bis zum rückstandslosen Teardown.
            </p>
          </div>

          <Link
            to="/architektur?tab=docs"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            <span>Spezifikation lesen</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {workflowSteps.map((wf) => (
            <div
              key={wf.step}
              className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3 space-y-1.5 hover:border-white/15 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-300 border border-white/10">
                  {wf.step}
                </span>
              </div>
              <h4 className="text-xs font-medium text-white">{wf.title}</h4>
              <p className="text-[11px] text-zinc-400 leading-snug">{wf.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Anforderungen A1 bis A7 Übersicht (Wissenschaftlicher Kriterienkatalog) */}
      <section className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
              <Zap className="h-3.5 w-3.5 text-zinc-400" />
              <span>Wissenschaftliche Zielsetzung</span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              Erfüllungsstatus der Kernanforderungen (A1 bis A7)
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Die 7 Kernanforderungen bilden den Kriterienkatalog der Praxisarbeit zur Absicherung und reproduzierbaren Bereitstellung der isolierten Cloud-Infrastruktur.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>7 von 7 Anforderungen verifiziert</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {requirementsList.map((req) => (
            <div
              key={req.code}
              className="p-4 rounded-xl border border-white/[0.06] bg-zinc-950/60 space-y-2 hover:border-white/15 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-xs text-zinc-200 bg-white/[0.05] px-2 py-0.5 rounded border border-white/10">
                  {req.code}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Verifiziert
                </span>
              </div>
              <h4 className="text-xs font-medium text-white">{req.title}</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{req.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sprach-Lernbereiche */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
              <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
              <span>Interaktive Module</span>
            </div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white">Programmiersprachen &amp; Testsuiten</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Jede Sprache wird ad-hoc in einer isolierten Docker-Sandbox ohne Netzwerk und mit harten Speichergrenzen ausgeführt.
            </p>
          </div>

          <Link
            to="/playground"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>Direkt zum freien Playground</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languageList.map((lang) => (
            <div
              key={lang.id}
              className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-zinc-900/70 shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono font-medium uppercase tracking-wider ${lang.accentClass}`}>
                    {lang.name}
                  </span>
                  <span className="text-xs font-mono bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
                    {lang.version}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-zinc-200 transition-colors">
                  {lang.name} Testsuite
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                  {lang.description}
                </p>

                {/* Lektionen-Liste */}
                <div className="space-y-1.5 mb-6">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Lerneinheiten:
                  </div>
                  {lang.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/lernen/${lang.id}/${lesson.id}`}
                      className="flex items-center justify-between text-xs text-zinc-300 hover:text-white py-1.5 border-b border-white/[0.04] last:border-none group/item transition-colors"
                    >
                      <span className="truncate">{lesson.title}</span>
                      <ArrowRight className="h-3 w-3 text-zinc-600 group-hover/item:text-zinc-300 group-hover/item:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to={`/lernen/${lang.id}/grundlagen`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2 px-4 text-xs font-medium transition-all bg-white text-zinc-950 hover:bg-zinc-200 shadow-xs cursor-pointer"
              >
                <span>Kurs starten</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

