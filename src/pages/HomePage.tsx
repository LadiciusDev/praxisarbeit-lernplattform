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
  Zap,
  BookOpen
} from 'lucide-react';

export const HomePage = () => {
  const languageList = Object.values(LANGUAGES_DATA);

  const requirementsList = [
    { code: 'A1', title: 'Zwei-VM-Architektur', desc: 'Physische Trennung von Web/API-Plattform und isolierter Ausführungs-VM.' },
    { code: 'A2', title: 'Ausführungstransparenz', desc: 'Vollständige Erfassung von stdout, stderr, Exit-Code und Ausführungszeit.' },
    { code: 'A3', title: 'Multi-Sprachen-Support', desc: 'Modulare Unterstützung von Python 3.11, OpenJDK 21 und JavaScript (Node 20).' },
    { code: 'A4', title: 'Netzwerk-Isolation', desc: 'Ausführungs-VM besitzt keine Public IP; Zugriff nur via privatem 10.10.1.0/24 vSwitch.' },
    { code: 'A5', title: 'Container-Hardening', desc: 'Docker Sandbox mit --network none, 512 MB RAM, 1 CPU und Non-Root-User.' },
    { code: 'A6', title: 'Fehlerprotokollierung', desc: 'Präzise Verifikation von Laufzeitfehlern (ZeroDivision, Exceptions, ExitCode != 0).' },
    { code: 'A7', title: 'Reproduzierbare IaC', desc: 'Vollständiger automatisierter Lebenszyklus (apply, plan, destroy) mit Terraform & OpenTofu.' },
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

      {/* Quick-Access Kacheln zur Praxisarbeit */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/architektur?tab=diagram"
          className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all hover:-translate-y-0.5 shadow-lg"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <GitBranch className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Architektur</span>
            </div>
            <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
              Zwei-VM-Setup
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interaktives Mermaid-Flowchart mit Zoom, Größenregler und hochauflösendem PNG/SVG-Export.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
            <span>Diagramm öffnen</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/architektur?tab=benchmarks"
          className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm hover:border-purple-500/50 hover:bg-slate-900/80 transition-all hover:-translate-y-0.5 shadow-lg"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <BarChart3 className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Evaluierung</span>
            </div>
            <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
              Benchmarks (K1–K5)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Terraform vs. OpenTofu Vergleichstabelle, Performance-Balken und Lizenz-Gegenüberstellung.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-400">
            <span>Messwerte ansehen</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/playground"
          className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all hover:-translate-y-0.5 shadow-lg"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Terminal className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Live Demo</span>
            </div>
            <h3 className="font-bold text-white group-hover:text-emerald-300 transition-colors">
              Code-Playground
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Freie Sprachauswahl (Python, Java, JS) mit Monaco Editor und Testfällen für Erfolgs- und Fehler-Metriken.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span>Playground starten</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/architektur?tab=docs"
          className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm hover:border-amber-500/50 hover:bg-slate-900/80 transition-all hover:-translate-y-0.5 shadow-lg"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileCode className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Doku</span>
            </div>
            <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors">
              Spezifikation (A1–A7)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vollständige Markdown/MDX Dokumentation mit Portmatrix, Sicherheitsrichtlinien und Versuchsablauf.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <span>Spezifikation lesen</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Praktischer Versuchsablauf (10 Schritte Pipeline) */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <Zap className="h-4 w-4" />
              <span>Experimenteller Aufbau</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Der 10-stufige Versuchsablauf der Praxisarbeit
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Vom Schreiben der Infrastructure-as-Code Manifeste bis zur rückstandslosen Freigabe aller Cloud-Knoten.
            </p>
          </div>

          <Link
            to="/architektur?tab=docs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
          >
            <span>Detaillierter Versuchsbericht (MDX)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {workflowSteps.map((wf) => (
            <div
              key={wf.step}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 space-y-2 hover:border-slate-700 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {wf.step}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
              </div>
              <h4 className="text-xs font-bold text-white">{wf.title}</h4>
              <p className="text-[11px] text-slate-400 leading-normal">{wf.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sprach-Lernbereiche */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Interaktive Module</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Programmiersprachen lernen</h2>
            <p className="text-sm text-slate-400 mt-1">
              Wähle eine Sprache, um die strukturierten Unterlektionen zu durchlaufen. Jede Lerneinheit verfügt über eine isolierte Testumgebung.
            </p>
          </div>

          <Link
            to="/playground"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Direkt zum freien Playground</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languageList.map((lang) => (
            <div
              key={lang.id}
              className={`flex flex-col justify-between rounded-2xl border ${lang.borderClass} bg-slate-900/40 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${lang.accentClass}`}>
                    {lang.name}
                  </span>
                  <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {lang.version}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {lang.name} Kurs
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {lang.description}
                </p>

                {/* Lektionen-Liste */}
                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Lerneinheiten:
                  </div>
                  {lang.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/lernen/${lang.id}/${lesson.id}`}
                      className="flex items-center justify-between text-xs text-slate-300 hover:text-cyan-400 py-1 border-b border-slate-800/60 last:border-none group/item"
                    >
                      <span className="truncate">{lesson.title}</span>
                      <ArrowRight className="h-3 w-3 text-slate-600 group-hover/item:text-cyan-400 group-hover/item:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to={`/lernen/${lang.id}/grundlagen`}
                className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold transition-all ${lang.bgClass} ${lang.accentClass} border ${lang.borderClass} hover:brightness-125`}
              >
                <span>Kurs starten</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Anforderungen A1 bis A7 Übersicht */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Wissenschaftliche Zielsetzung</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Erfüllungsstatus der Anforderungen (A1 bis A7)
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Die folgenden 7 Kernanforderungen bilden den Kriterienkatalog der Praxisarbeit zur Absicherung und Evaluation der Cloud-Infrastruktur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {requirementsList.map((req) => (
            <div
              key={req.code}
              className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {req.code}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Erfüllt
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">{req.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{req.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

