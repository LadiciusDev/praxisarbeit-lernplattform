import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MermaidViewer } from '../components/common/MermaidViewer';
import { MdxRenderer } from '../components/common/MdxRenderer';
import { BenchmarkComparison } from '../components/architecture/BenchmarkComparison';
import { Network, FileCode, GitCommit, Eye, BarChart3 } from 'lucide-react';

type ArchitectureTab = 'diagram' | 'sequence' | 'docs' | 'benchmarks';

const SEQUENCE_DIAGRAM_CHART = `sequenceDiagram
    autonumber
    participant Client as Plattform-VM (10.10.1.10)
    participant API as FastAPI Daemon (:8080)
    participant FS as Host-Dateisystem (/tmp/runner)
    participant Docker as Docker Engine (Sandbox)

    Client->>API: POST /execute { language, code }
    Note over API: 1. Pydantic-Validierung (Payload max 64 KB)
    Note over API: 2. UUID & Timer generieren
    API->>FS: Schreibt Code nach /tmp/runner/job_{id}/main.* (chmod 0644)
    
    API->>Docker: docker run --rm --network none --user 1000:1000 ...
    alt Normale Ausführung (<= 10s)
        Docker-->>API: stdout, stderr, exitCode
    else Timeout (> 10s)
        API->>Docker: docker kill / terminate
        Note over API: exitCode = 124, timeout message in stderr
    end

    API->>FS: rm -rf /tmp/runner/job_{id} (finally Block)
    Note over API: 3. Audit-Log schreiben (A6: Nur Metadaten)
    API-->>Client: 200 OK { jobId, stdout, stderr, exitCode, executionTimeMs, timestamp }
`;

const DEFAULT_MERMAID_CHART = `flowchart TD
    subgraph Internet["Öffentliches Internet"]
        User["Benutzer (Browser)"]
    end

    subgraph PlatformVM["Öffentliche Plattform-VM (195.x.x.x / 10.10.1.10)"]
        direction TB
        Nginx["Nginx Reverse Proxy & Static Host<br/>(:80 HTTP / :443 HTTPS)"]
        SPA["Lernplattform Web-Frontend<br/>(React + Vite SPA)"]
        Proxy["API Gateway Weiterleitung<br/>(/api/execute)"]
        Nginx --- SPA
        Nginx --- Proxy
    end

    subgraph PrivateNet["Privates Hetzner-Netzwerk (10.10.1.0/24)"]
        PrivateTraffic["REST Traffic (:8080)<br/>Host-Firewall: nur 10.10.1.10 erlaubt"]
    end

    subgraph ExecVM["Isolierte Ausführungs-VM (10.10.1.20 - KEINE Public IP!)"]
        direction TB
        Daemon["Ausführungsdienst Daemon<br/>(Port :8080)"]
        subgraph Sandbox["Ephemere Docker Sandbox (A5)"]
            Container["Begrenzter Testcontainer<br/>• --network none<br/>• 512 MB RAM / 1 CPU<br/>• Non-Root Benutzer<br/>• max. 10s Timeout"]
        end
        Daemon -->|"Startet Container"| Container
        Container -->|"stdout, stderr, exitCode"| Daemon
    end

    User -->|"HTTPS (:443)"| Nginx
    Proxy -->|"Interner Call"| PrivateTraffic
    PrivateTraffic -->|"10.10.1.20:8080"| Daemon`;

const ARCHITECTURE_DOC_MD = `## Architektur-Dokumentation der Praxisarbeit

### Forschungsfrage & Zielsetzung
Untersuchung der Unterschiede zwischen **Terraform** und **OpenTofu** bei der Umsetzung definierter Sicherheits- und Reproduzierbarkeitsanforderungen an eine Cloud-Infrastruktur für isolierte Codeausführungsumgebungen.

---

### Vergleichskriterien: Terraform vs. OpenTofu (K1 – K5)

Die Evaluation beider Werkzeuge erfolgt anhand von fünf definierten Kernkriterien:

| ID | Kriterium | Leitfrage & Untersuchungsschwerpunkt |
| :--- | :--- | :--- |
| **K1** | **Codeportabilität** | Kann dieselbe HCL-Basiskonfiguration mit beiden Werkzeugen ohne syntaktische oder semantische Anpassungen ausgeführt werden? |
| **K2** | **State- und Plan-Schutz** | Wie schützen beide Werkzeuge lokal und remote gespeicherte State-Informationen sowie sensitive Attribute im Execution Plan (z. B. State Encryption bei OpenTofu)? |
| **K3** | **Provider- und Lockfile-Verhalten** | Welche Provider-Versionen, Registry-Quellen und Prüfsummen werden ausgewählt? Unterscheiden sich \`.terraform.lock.hcl\` und Auflösungsmechanismen? |
| **K4** | **Idempotenz und Drift-Erkennung** | Zeigen beide Werkzeuge nach erfolgreichem Apply einen echten No-Op-Plan? Wie präzise erkennen sie manuelle Eingriffe an Firewall- oder Server-Ressourcen? |
| **K5** | **Bedienbarkeit und Diagnose** | Wie unterscheiden sich Arbeitsablauf, Ausführungsgeschwindigkeit, Fehlermeldungen bei Ressourcenkonflikten und Diagnosemöglichkeiten? |

---

### Praktischer Versuchsablauf (10-Schritte-Zyklus)

Um identische Testbedingungen zu garantieren, wird dieselbe Zwei-VM-Umgebung sequenziell mit beiden Werkzeugen aufgesetzt, geprüft und zerstört:

\`\`\`mermaid
flowchart LR
    subgraph Phase1["Phase 1: Bereitstellung & Test"]
        direction LR
        A["1. Init & Validate"] --> B["2. Plan & Apply"] --> C["3. Funktions- & Security-Test"]
    end
    subgraph Phase2["Phase 2: Idempotenz & Lifecycle"]
        direction LR
        D["4. Idempotenz (No-Op)"] --> E["5. Drift-Test"] --> F["6. Destroy & Re-Apply"]
    end
    Phase1 --> Phase2
\`\`\`


1. **Initialisierung & Validierung:** \`init\` und Syntaxprüfung der HCL-Konfiguration.
2. **Planung & Bereitstellung:** Generierung des Ausführungsplans und automatisiertes Erstellen beider VMs, Netzwerk und Firewalls.
3. **Funktionstest der Lernplattform:** Codeannahme, Übertragung über privates Netz, Ausführung in Docker-Sandbox (Anforderung A2).
4. **Sicherheitsprüfung:** Portscan von außen (A3), Isolation der Ausführungs-VM prüfen (A4), Limits des Testcontainers verifizieren (A5).
5. **Logging & Transparenz:** Prüfung von Job-IDs, Laufzeitmessung und Fehlen von Secrets in Logs (A6).
6. **Idempotenz-Test:** Erneuter \`plan\`-Aufruf ohne Änderungen (Erwartung: *No changes. Your infrastructure matches the configuration.*).
7. **Drift-Erkennung:** Harmlose manuelle Änderung in Hetzner Cloud vornehmen (z. B. Label oder Firewall-Regel) und Prüfung, ob der Drift erkannt wird.
8. **Vollständiges Destroy:** Zerstörung der Infrastruktur und Prüfung des sauberen Leerzustands im Hetzner-Projekt.
9. **Reproduzierbarkeit (A7):** Erneuter Aufbau mit identischen Variablen ohne manuelle Eingriffe.
10. **Werkzeugwechsel:** Wiederholung aller 9 Schritte mit **OpenTofu** unter denselben Rahmenbedingungen.

---

### Systemanforderungen & Nachweismatrix (A1 – A7)

| ID | Anforderung | Technische Umsetzung & Nachweis |
| :--- | :--- | :--- |
| **A1** | **Automatisierte Bereitstellung** | Plattform-VM, Ausführungs-VM, privates Netzwerk, Firewall und Betriebssystemkonfiguration werden vollständig durch IaC und Cloud-init bereitgestellt. |
| **A2** | **Funktionsfähige Lernplattform** | Die Plattform nimmt Testcode entgegen, übermittelt ihn an die interne Ausführungs-VM und zeigt \`stdout\`, \`stderr\` und Exit-Code an. |
| **A3** | **Schutz der öffentlichen Plattform** | Nur HTTPS (Port 443) und eingeschränkter SSH-Zugriff (Schlüssel, Quell-IP-Filter) sind öffentlich erreichbar. |
| **A4** | **Isolation der Ausführungs-VM** | Keine öffentliche Primary IP; Verbindung nur über privates Hetzner-Netzwerk. Host-Firewall lässt nur 10.10.1.10 auf Port 8080 zu. |
| **A5** | **Begrenzte Codeausführung** | Ausführung in nicht-privilegiertem Container: \`--network none\`, \`--memory 512m\`, \`--cpus 1\`, Non-Root-User, 10s Timeout. |
| **A6** | **Logging ohne Geheimnisse** | Protokollierung von Job-ID, Zeitstempel, Dauer und Exit-Code. Keine Speicherung von Quellcode oder Zugangsdaten in Logs. |
| **A7** | **Reproduzierbarer Lebenszyklus** | Kompletter Lebenszyklus (\`apply → destroy → apply\`) lässt sich ohne Reste und ohne manuelle Nacharbeit durchführen. |

---

### Netzwerk- und Port-Matrix

\`\`\`mermaid
flowchart LR
    User["Nutzer (Browser)"] -->|"HTTPS (:443)"| Platform["Öffentliche Plattform-VM<br/>(10.10.1.10)"]
    Platform -->|"Privates Netz (:8080)"| Exec["Isolierte Ausführungs-VM<br/>(10.10.1.20)"]
\`\`\`

* **Plattform-VM (Öffentlich erreichbar):**
  * Port 80 (HTTP) -> 301 Redirect auf Port 443 (HTTPS)
  * Nginx serviert statisches React-Frontend
  * Pfad \`/api/execute\` wird per \`proxy_pass\` transparent an \`http://10.10.1.20:8080/execute\` weitergeleitet.
* **Ausführungs-VM (Vollständig isoliert):**
  * **Keine öffentliche IP-Adresse!**
  * Host-Firewall (UFW) blockiert alle Zugriffe außer von IP \`10.10.1.10\` auf Port \`8080\`.
  * Ausführungsdienst startet für jeden Auftrag ad-hoc einen kurzlebigen Docker-Container.
`;


export const ArchitecturePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as ArchitectureTab | null;

  const validTabs: ArchitectureTab[] = ['diagram', 'sequence', 'docs', 'benchmarks'];
  const activeTab: ArchitectureTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'diagram';

  const handleTabChange = (newTab: ArchitectureTab) => {
    setSearchParams({ tab: newTab });
  };

  return (
    <div className="space-y-8">
      {/* Kopfbereich */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <Network className="h-4 w-4" />
          <span>Praxisarbeit • Infrastruktur &amp; Sicherheits-Design</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Soll-Architektur: Hetzner Cloud Zwei-VM-Setup
        </h1>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Hier findest du die vollständige Architektur für den Vergleich von Terraform und OpenTofu.
          Das Diagramm wird live über <strong>Mermaid Markdown</strong> gerendert und kann direkt als
          <strong> hochauflösendes PNG</strong> für deine schriftliche 20-seitige Arbeit exportiert werden.
        </p>

        {/* Tab-Auswahl */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => handleTabChange('diagram')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'diagram'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Topologie-Diagramm</span>
          </button>

          <button
            onClick={() => handleTabChange('sequence')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'sequence'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
          >
            <GitCommit className="h-3.5 w-3.5" />
            <span>Ablauf-Sequenzdiagramm</span>
          </button>

          <button
            onClick={() => handleTabChange('docs')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'docs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Spezifikation &amp; Anforderungen (MDX)</span>
          </button>

          <button
            onClick={() => handleTabChange('benchmarks')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${activeTab === 'benchmarks'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
            <span>Messwerte &amp; Vergleich (K1–K5)</span>
          </button>
        </div>
      </div>

      {/* Tab Inhalt: Topologie-Diagramm */}
      {activeTab === 'diagram' && (
        <div className="space-y-4">
          <MermaidViewer chart={DEFAULT_MERMAID_CHART} title="Hetzner-Cloud-Soll-Architektur" defaultSize="sm" />


        </div>
      )}

      {/* Tab Inhalt: Ablauf-Sequenzdiagramm */}
      {activeTab === 'sequence' && (
        <div className="space-y-6">
          <MermaidViewer
            chart={SEQUENCE_DIAGRAM_CHART}
            title="Ablauf-Sequenzdiagramm: Code Execution Service"
            defaultSize="xl"
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 space-y-4 backdrop-blur-sm">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Detailanalyse des Ausführungsablaufs (Anforderungen A2, A5 &amp; A6)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Das Sequenzdiagramm dokumentiert den lückenlosen Lebenszyklus eines Testauftrags auf der isolierten Ausführungs-VM.
              Der Daemon verarbeitet jeden Auftrag strikt isoliert nach dem <em>Least-Privilege-Prinzip</em>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Schritt 1–2: Ingress &amp; Validierung
                </span>
                <h4 className="text-xs font-semibold text-white">Payload-Schutz &amp; Timing</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pydantic prüft die Payload-Größe (max. 64 KB). Eine eindeutige Job-UUID wird vergeben und die Hochpräzisions-Zeitmessung gestartet.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Schritt 3–4: Sandbox-Lauf (A5)
                </span>
                <h4 className="text-xs font-semibold text-white">Isolation &amp; Timeout (max. 5s)</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Docker startet mit <code>--network none</code> als Non-Root (1000:1000). Überschreitet der Code 5 Sekunden, greift der Timeout-Kill mit Exit-Code 124.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Schritt 5–6: Egress &amp; Audit (A6)
                </span>
                <h4 className="text-xs font-semibold text-white">Cleanup &amp; Metriken</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Temporäre Verzeichnisse werden im <code>finally</code>-Block restlos gelöscht. Metadaten (stdout, stderr, exitCode, ms) gehen als JSON zurück.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Inhalt: MDX Dokumentation */}
      {activeTab === 'docs' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm">
          <MdxRenderer content={ARCHITECTURE_DOC_MD} />
        </div>
      )}

      {/* Tab Inhalt: Benchmark & Messwerte Vergleich */}
      {activeTab === 'benchmarks' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm">
          <BenchmarkComparison />
        </div>
      )}
    </div>
  );
};
