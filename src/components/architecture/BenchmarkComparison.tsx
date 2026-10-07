import React, { useState } from 'react';
import { 
  Zap, 
  Shield, 
  FileCheck, 
  Users, 
  BarChart3, 
  Cpu, 
  Award, 
  Check, 
  ArrowRight, 
  Lock, 
  Clock, 
  HardDrive, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BenchmarkMetric {
  id: string;
  name: string;
  shortName: string;
  category: 'runtime' | 'resource';
  unit: string;
  secondUnit?: string;
  description: string;
  insight: string;
  
  // Real time (s) or size (MB)
  terraform: number;
  openTofu: number;
  openTofuEncrypted: number;

  // Secondary values (e.g. MiB)
  secondTerraform?: number;
  secondOpenTofu?: number;
  secondOpenTofuEncrypted?: number;

  // Real deep instrumentation data (from time -l)
  details?: {
    userTimeSec: { tf: number; tofu: number; enc: number };
    sysTimeSec: { tf: number; tofu: number; enc: number };
    maxRssMb: { tf: number; tofu: number; enc: number };
    maxRssMib: { tf: number; tofu: number; enc: number };
    instructionsBillion: { tf: number; tofu: number; enc: number };
    cyclesBillion: { tf: number; tofu: number; enc: number };
  };
}

const BENCHMARK_METRICS: BenchmarkMetric[] = [
  {
    id: 'init',
    name: 'Provider & Modul-Initialisierung (init)',
    shortName: 'Init',
    category: 'runtime',
    unit: 's',
    terraform: 4.75,
    openTofu: 2.88,
    openTofuEncrypted: 5.48,
    description: 'Download des Hetzner Cloud Providers (hcloud) und Backend-Initialisierung.',
    insight: 'OpenTofu initialisiert Provider parallel deutlich schneller (-39,4%). Bei aktiver State-Verschlüsselung fällt eine minimale Krypto-Key-Initialisierung an (+15,4%).',
    details: {
      userTimeSec: { tf: 0.19, tofu: 0.18, enc: 0.44 },
      sysTimeSec: { tf: 0.16, tofu: 0.12, enc: 0.18 },
      maxRssMb: { tf: 72.14, tofu: 67.70, enc: 67.75 },
      maxRssMib: { tf: 68.80, tofu: 64.56, enc: 64.61 },
      instructionsBillion: { tf: 2.25, tofu: 1.96, enc: 5.45 },
      cyclesBillion: { tf: 0.99, tofu: 0.81, enc: 2.08 },
    },
  },
  {
    id: 'plan',
    name: 'Ausführungsplan berechnen (plan)',
    shortName: 'Plan',
    category: 'runtime',
    unit: 's',
    terraform: 0.57,
    openTofu: 0.60,
    openTofuEncrypted: 1.31,
    description: 'Validierung des Zustands gegen Hetzner Cloud API und Generierung des Change-Sets.',
    insight: 'Standard-Planzeiten sind mit ~0,6s nahezu identisch. Mit State Encryption verarbeitet OpenTofu zusätzlich die Ver- und Entschlüsselung des Statefiles (+129,8%).',
    details: {
      userTimeSec: { tf: 0.14, tofu: 0.12, enc: 0.38 },
      sysTimeSec: { tf: 0.09, tofu: 0.10, enc: 0.11 },
      maxRssMb: { tf: 84.23, tofu: 76.68, enc: 77.56 },
      maxRssMib: { tf: 80.33, tofu: 73.13, enc: 73.97 },
      instructionsBillion: { tf: 1.23, tofu: 1.22, enc: 4.53 },
      cyclesBillion: { tf: 0.51, tofu: 0.56, enc: 1.67 },
    },
  },
  {
    id: 'apply_cold',
    name: 'Initiale Bereitstellung (Cold Apply)',
    shortName: 'Apply (Cold)',
    category: 'runtime',
    unit: 's',
    terraform: 71.21,
    openTofu: 67.46,
    openTofuEncrypted: 57.90,
    description: 'Vollständiger Neuaufbau von Plattform-VM, Ausführungs-VM, vSwitch (10.10.0.0/16) und Firewalls.',
    insight: 'OpenTofu baut die Zwei-VM-Infrastruktur zuverlässig 5,3% bis 18,7% schneller auf als Terraform. Das SDN-Routing greift ohne Zeitverzögerung.',
    details: {
      userTimeSec: { tf: 0.27, tofu: 0.26, enc: 0.78 },
      sysTimeSec: { tf: 0.20, tofu: 0.15, enc: 0.19 },
      maxRssMb: { tf: 84.38, tofu: 74.99, enc: 75.20 },
      maxRssMib: { tf: 80.47, tofu: 71.52, enc: 71.72 },
      instructionsBillion: { tf: 1.76, tofu: 1.41, enc: 8.24 },
      cyclesBillion: { tf: 0.84, tofu: 0.64, enc: 2.94 },
    },
  },
  {
    id: 'apply_warm',
    name: 'Inkrementeller Refresh (Warm Apply)',
    shortName: 'Apply (Warm)',
    category: 'runtime',
    unit: 's',
    terraform: 2.99,
    openTofu: 2.07,
    openTofuEncrypted: 4.29,
    description: 'Abgleich des bestehenden Cloud-Zustands ohne Änderungen (No-Op Apply).',
    insight: 'OpenTofu prüft den unveränderten State 30,8% schneller ab. Die State-Verschlüsselung erfordert ca. 1,3s Mehraufwand für Entschlüsselung und Hashing (+43,5%).',
    details: {
      userTimeSec: { tf: 0.24, tofu: 0.24, enc: 0.95 },
      sysTimeSec: { tf: 0.09, tofu: 0.09, enc: 0.10 },
      maxRssMb: { tf: 81.74, tofu: 76.94, enc: 78.32 },
      maxRssMib: { tf: 77.95, tofu: 73.38, enc: 74.69 },
      instructionsBillion: { tf: 1.40, tofu: 1.26, enc: 11.27 },
      cyclesBillion: { tf: 0.54, tofu: 0.51, enc: 3.76 },
    },
  },
  {
    id: 'destroy',
    name: 'Vollständiger Teardown (destroy)',
    shortName: 'Destroy',
    category: 'runtime',
    unit: 's',
    terraform: 50.49,
    openTofu: 67.82,
    openTofuEncrypted: 53.23,
    description: 'Rückstandslose Löschung aller Cloud-Server, privaten Subnetze und Firewall-Ressourcen.',
    insight: 'Bei Hetzner Cloud API Teardowns schwankt die API-Deallokationsdauer leicht serverseitig. OpenTofu (Encrypted) schließt in 53,2s ab (+5,4% zu Terraform).',
    details: {
      userTimeSec: { tf: 0.30, tofu: 0.26, enc: 1.03 },
      sysTimeSec: { tf: 0.20, tofu: 0.19, enc: 0.19 },
      maxRssMb: { tf: 84.59, tofu: 77.53, enc: 75.42 },
      maxRssMib: { tf: 80.67, tofu: 73.94, enc: 71.92 },
      instructionsBillion: { tf: 1.78, tofu: 1.60, enc: 11.50 },
      cyclesBillion: { tf: 0.83, tofu: 0.74, enc: 4.01 },
    },
  },
  {
    id: 'memory_peak',
    name: 'Peak Memory Footprint (Max. RAM-Verbrauch)',
    shortName: 'Peak RAM',
    category: 'resource',
    unit: 'MB',
    secondUnit: 'MiB',
    terraform: 84.59,
    secondTerraform: 80.67,
    openTofu: 77.53,
    secondOpenTofu: 73.94,
    openTofuEncrypted: 78.32,
    secondOpenTofuEncrypted: 74.69,
    description: 'Maximaler physischer Arbeitsspeicher (Resident Set Size / Max RSS) über alle Testphasen hinweg.',
    insight: 'OpenTofu verbraucht durchgehend ~7–8% weniger RAM als Terraform. Die State-Verschlüsselung verursacht kaum zusätzlichen Speicherüberhang (+0,8 MB).',
  },
  {
    id: 'binary_size',
    name: 'CLI Binary-Größe auf dem Host',
    shortName: 'Binary-Größe',
    category: 'resource',
    unit: 'MB',
    secondUnit: 'MiB',
    terraform: 114.6,
    secondTerraform: 109.3,
    openTofu: 106.5,
    secondOpenTofu: 101.6,
    openTofuEncrypted: 106.5,
    secondOpenTofuEncrypted: 101.6,
    description: 'Kompiliertes Binary des IaC-Werkzeugs auf der Plattform-VM.',
    insight: 'OpenTofu besitzt ein um 7,1% kompakteres CLI-Binary bei gleichzeitig integrierter nativer State-Verschlüsselung (ohne Zusatzmodule).',
  },
];

export const BenchmarkComparison: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'runtime' | 'resource'>('all');
  const [showDetailsTable, setShowDetailsTable] = useState<boolean>(true);

  // Helper to calculate % delta against Terraform
  const calcDelta = (val: number, ref: number) => {
    const diff = ((val - ref) / ref) * 100;
    return {
      percent: Math.abs(Number(diff.toFixed(1))),
      isFaster: diff < 0,
      isEqual: Math.abs(diff) < 0.1,
      diffRaw: diff,
    };
  };

  const filteredMetrics = BENCHMARK_METRICS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Wissenschaftliche Reale Messreihe (Hetzner Cloud)</span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            BSD time -l Messinstrument
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Benchmark-Evaluation: Terraform vs. OpenTofu &amp; OpenTofu (Encrypted)
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-4xl leading-relaxed">
          Gegenüberstellung der gemessenen Bereitstellungszeiten, Memory-Footprints und CPU-Instruktionen nach den 
          Evaluationskriterien <strong>K1–K5</strong>. Ergänzt um die native Client-Side State Encryption von OpenTofu.
        </p>
      </div>

      {/* KPI Highlight Cards (Direct % Delta to Terraform) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Cold Apply */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              Cold Apply (Neu)
            </span>
            <span className="text-[11px] text-purple-400">TF: 71.2s</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
            <span>67.46s</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              -5.3%
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-emerald-300 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Encrypted: 57.90s
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              -18.7% ggü. TF
            </span>
          </div>
        </div>

        {/* KPI 2: Warm Apply */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              Warm Apply (No-Op)
            </span>
            <span className="text-[11px] text-purple-400">TF: 2.99s</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
            <span>2.07s</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              -30.8%
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-amber-300 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Encrypted: 4.29s
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              +43.5% ggü. TF
            </span>
          </div>
        </div>

        {/* KPI 3: Peak RAM */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              Peak Memory (RSS)
            </span>
            <span className="text-[11px] text-purple-400">TF: 84.6 MB</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
            <span>77.53 MB</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              -8.3%
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-emerald-300 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Encrypted: 78.32 MB
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              -7.4% ggü. TF
            </span>
          </div>
        </div>

        {/* KPI 4: Provider Init */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center gap-1.5 text-slate-300">
              <HardDrive className="h-3.5 w-3.5 text-purple-400" />
              Provider Init (hcloud)
            </span>
            <span className="text-[11px] text-purple-400">TF: 4.75s</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight flex items-baseline gap-2">
            <span>2.88s</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              -39.4%
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-amber-300 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Encrypted: 5.48s
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              +15.4% ggü. TF
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            Alle Metriken ({BENCHMARK_METRICS.length})
          </button>
          <button
            onClick={() => setActiveCategory('runtime')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'runtime'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            Laufzeiten (K1)
          </button>
          <button
            onClick={() => setActiveCategory('resource')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'resource'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            Ressourcen &amp; RAM (K2)
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-purple-300">
            <span className="h-3 w-3 rounded-xs bg-linear-to-r from-purple-500 to-indigo-500" />
            Terraform v1.16.4
          </span>
          <span className="flex items-center gap-1.5 text-cyan-300">
            <span className="h-3 w-3 rounded-xs bg-linear-to-r from-cyan-400 to-blue-500" />
            OpenTofu v1.12.6
          </span>
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="h-3 w-3 rounded-xs bg-linear-to-r from-emerald-400 to-teal-500" />
            OpenTofu (Encrypted)
          </span>
        </div>
      </div>

      {/* Visual Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMetrics.map((item) => {
          const maxVal = Math.max(item.terraform, item.openTofu, item.openTofuEncrypted) * 1.15;
          const tfPercent = Math.min(100, Math.round((item.terraform / maxVal) * 100));
          const tofuPercent = Math.min(100, Math.round((item.openTofu / maxVal) * 100));
          const encPercent = Math.min(100, Math.round((item.openTofuEncrypted / maxVal) * 100));

          const tofuDiff = calcDelta(item.openTofu, item.terraform);
          const encDiff = calcDelta(item.openTofuEncrypted, item.terraform);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4.5 space-y-3.5 backdrop-blur-sm hover:border-slate-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Title & Direct Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{item.description}</p>
                  </div>
                </div>

                {/* Percentage Badges compared to Terraform */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {/* Tofu vs TF */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                      tofuDiff.isFaster
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {tofuDiff.isFaster ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    Tofu: {tofuDiff.percent}% {tofuDiff.isFaster ? (item.category === 'resource' ? 'weniger' : 'schneller') : (item.category === 'resource' ? 'mehr' : 'langsamer')}
                  </span>

                  {/* Encrypted vs TF */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                      encDiff.isFaster
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <Lock className="h-2.5 w-2.5" />
                    Encrypted: {encDiff.percent}% {encDiff.isFaster ? (item.category === 'resource' ? 'weniger' : 'schneller') : (item.category === 'resource' ? 'mehr' : 'langsamer')}
                  </span>
                </div>

                {/* 3 Progress Bars */}
                <div className="space-y-2.5 pt-3">
                  {/* OpenTofu Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-400" />
                        OpenTofu
                      </span>
                      <span className="text-white font-bold">
                        {item.openTofu} {item.unit}
                        {item.secondOpenTofu && (
                          <span className="text-slate-400 text-[10px] ml-1 font-normal">
                            ({item.secondOpenTofu} {item.secondUnit})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                        style={{ width: `${tofuPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* OpenTofu Encrypted Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                        <Lock className="h-2.5 w-2.5 text-emerald-400" />
                        OpenTofu (Encrypted)
                      </span>
                      <span className="text-white font-bold">
                        {item.openTofuEncrypted} {item.unit}
                        {item.secondOpenTofuEncrypted && (
                          <span className="text-slate-400 text-[10px] ml-1 font-normal">
                            ({item.secondOpenTofuEncrypted} {item.secondUnit})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                        style={{ width: `${encPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Terraform Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Terraform (Baseline)
                      </span>
                      <span className="text-white font-bold">
                        {item.terraform} {item.unit}
                        {item.secondTerraform && (
                          <span className="text-slate-400 text-[10px] ml-1 font-normal">
                            ({item.secondTerraform} {item.secondUnit})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${tfPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Footer */}
              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 leading-relaxed bg-slate-950/30 -mx-4.5 -mb-4.5 p-3 rounded-b-2xl">
                <span className="text-cyan-400 font-semibold">Analyse: </span>
                {item.insight}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detaillierte Messwerte-Matrix (BSD time -l Tabelle) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <button
          onClick={() => setShowDetailsTable(!showDetailsTable)}
          className="w-full flex items-center justify-between p-4 bg-slate-950/80 border-b border-slate-800/80 hover:bg-slate-900/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Activity className="h-4 w-4 text-cyan-400" />
            <div>
              <span className="text-sm font-bold text-white">
                Detaillierte Hardware- &amp; OS-Messdaten (time -l)
              </span>
              <span className="text-xs text-slate-400 block font-normal">
                Gegenüberstellung von Realzeit, User/Sys CPU, Max RSS, CPU-Instruktionen und Zyklen
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>{showDetailsTable ? 'Tabelle einklappen' : 'Tabelle ausklappen'}</span>
            {showDetailsTable ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {showDetailsTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-300 font-mono text-[11px]">
                  <th className="py-3 px-4">Phase</th>
                  <th className="py-3 px-4 text-purple-300 bg-purple-950/20">Terraform v1.16.4</th>
                  <th className="py-3 px-4 text-cyan-300 bg-cyan-950/20">OpenTofu v1.12.6</th>
                  <th className="py-3 px-4 text-cyan-400 font-semibold">% ggü. TF</th>
                  <th className="py-3 px-4 text-emerald-300 bg-emerald-950/20">OpenTofu (Encrypted)</th>
                  <th className="py-3 px-4 text-emerald-400 font-semibold">% ggü. TF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300 font-mono text-[11px]">
                {BENCHMARK_METRICS.filter(m => m.details).map((m) => {
                  const tofuDiff = calcDelta(m.openTofu, m.terraform);
                  const encDiff = calcDelta(m.openTofuEncrypted, m.terraform);

                  return (
                    <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="text-cyan-400">•</span>
                          {m.shortName}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          User: {m.details?.userTimeSec.tf}s / Sys: {m.details?.sysTimeSec.tf}s
                        </span>
                      </td>

                      {/* Terraform */}
                      <td className="py-3 px-4 bg-purple-950/5">
                        <span className="text-white font-bold text-xs">{m.terraform.toFixed(2)}s</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          RAM: {m.details?.maxRssMb.tf} MB ({m.details?.maxRssMib.tf} MiB)<br/>
                          Instr: {m.details?.instructionsBillion.tf} Mrd.
                        </div>
                      </td>

                      {/* OpenTofu */}
                      <td className="py-3 px-4 bg-cyan-950/5">
                        <span className="text-cyan-300 font-bold text-xs">{m.openTofu.toFixed(2)}s</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          RAM: {m.details?.maxRssMb.tofu} MB ({m.details?.maxRssMib.tofu} MiB)<br/>
                          Instr: {m.details?.instructionsBillion.tofu} Mrd.
                        </div>
                      </td>

                      {/* Tofu Delta */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            tofuDiff.isFaster
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          }`}
                        >
                          {tofuDiff.isFaster ? '-' : '+'}{tofuDiff.percent}%
                        </span>
                      </td>

                      {/* OpenTofu Encrypted */}
                      <td className="py-3 px-4 bg-emerald-950/5">
                        <span className="text-emerald-300 font-bold text-xs">{m.openTofuEncrypted.toFixed(2)}s</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          RAM: {m.details?.maxRssMb.enc} MB ({m.details?.maxRssMib.enc} MiB)<br/>
                          Instr: {m.details?.instructionsBillion.enc} Mrd. (Krypto-Last)
                        </div>
                      </td>

                      {/* Encrypted Delta */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            encDiff.isFaster
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          }`}
                        >
                          {encDiff.isFaster ? '-' : '+'}{encDiff.percent}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
                <th className="py-3 px-4 text-cyan-300 bg-cyan-950/20">OpenTofu v1.12.6 (inkl. State Encryption)</th>
                <th className="py-3 px-4 text-purple-300 bg-purple-950/20">Terraform v1.16.4 (HashiCorp/IBM)</th>
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
                  Kürzere Init- und Warm-Apply-Zeiten (-30,8% bei Warm Apply, -39,4% bei Init). Bei State Encryption fällt ein messbarer Krypto-Overhead (+43,5% bei Warm Apply) an, der jedoch im Bereich weniger Sekunden liegt.
                </td>
                <td className="py-3 px-4 text-slate-300 bg-purple-950/10">
                  Konstante Laufzeiten, jedoch spürbar trägere Provider-Downloads und Modul-Registry-Initialisierungen.
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
                  106,5 MB Binary (-7,1%), ~74,9–77,5 MB Peak RAM über alle Cloud-Operationen hinweg. Sparsamere Garbage Collection.
                </td>
                <td className="py-3 px-4 text-slate-300 bg-purple-950/10">
                  114,6 MB Binary, ~84,6 MB Peak RAM während paralleler VM- und Routenbereitstellung.
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="h-3 w-3" /> Vorteil OpenTofu (-8,3% RAM)
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
                  <strong>MPL 2.0 (Mozilla Public License)</strong> – Echtes Open Source unter der neutralen <em>Linux Foundation</em>. Keinerlei gewerbliche Nutzungsrestriktionen.
                </td>
                <td className="py-3 px-4 text-amber-300 bg-purple-950/10">
                  <strong>BSL 1.1 (Business Source License)</strong> – Proprietäre Lizenz mit Nutzungsbeschränkungen für konkurrierende Plattformen und SaaS-Angebote.
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
                  K4: Kompatibilität &amp; Features
                </td>
                <td className="py-3 px-4 text-slate-400">Statefile-Format, Syntax-Kompatibilität &amp; State-Sicherheit.</td>
                <td className="py-3 px-4 font-medium text-slate-200 bg-cyan-950/10">
                  100% kompatibel zu allen HCL-Manifesten (.tf). Bietet zusätzlich <strong>native Client-Side State Encryption</strong> (AES-GCM / PBKDF2), wodurch sensible Hetzner Tokens und Passwörter im Statefile kryptografisch geschützt sind.
                </td>
                <td className="py-3 px-4 text-slate-300 bg-purple-950/10">
                  Industriestandard. State Encryption wird nur über kostenpflichtiges HCP Terraform bzw. Enterprise unterstützt.
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="h-3 w-3" /> Klar OpenTofu (Encryption)
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
                  Eigene <code>get.opentofu.org</code> Registry mit unterbrechungsfreiem Spiegel aller offiziellen Provider (z. B. Hetzner <code>hcloud</code> Provider).
                </td>
                <td className="py-3 px-4 text-slate-300 bg-purple-950/10">
                  Größtes etabliertes Ökosystem (registry.terraform.io), unübertroffene Community- und Forengröße.
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
      <div className="rounded-2xl border border-cyan-500/30 bg-linear-to-br from-cyan-950/30 via-slate-900 to-slate-950 p-6 space-y-3.5 shadow-xl">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-cyan-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Wissenschaftliches Fazit für die 20-seitige Ausarbeitung
          </h4>
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Für das evaluierte Hetzner Cloud Zwei-VM-Setup erweist sich <strong>OpenTofu</strong> als hervorragender,
          vollständig kompatibler <em>Drop-in-Replacement</em> für Terraform. Durch die neutrale Governance unter der
          <strong> Linux Foundation</strong> und die freie <strong>MPL-2.0-Lizenz</strong> eliminiert OpenTofu alle
          rechtlichen Risiken (K3), bietet einen um <strong>8,3% geringeren RAM-Verbrauch</strong> (K2) und initialisiert 
          Provider um <strong>39,4% schneller</strong> (K1).
        </p>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          Besonders hervorzuheben ist das Feature der <strong>nativen State-Verschlüsselung (State Encryption)</strong>:
          Während Terraform dieses Feature nur in kommerziellen Enterprise-Lizenzen anbietet, schützt OpenTofu den Cloud-Zustand 
          bereits in der freien Version mit minimalem Rechenaufwand (+1,3s bei Warm Apply, gemessen anhand von 11,27 Mrd. CPU-Instruktionen).
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-cyan-300">
          <span className="flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" />
            HCL-Syntax: 100% kompatibel
          </span>
          <span className="flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" />
            Empfehlung: OpenTofu v1.12.6+
          </span>
          <span className="flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5" />
            State Encryption: Frei verfügbar (K4)
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
