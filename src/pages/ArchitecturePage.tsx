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
| **A4** | **Isolation der Ausführungs-VM** |Die Execution-VM darf keine öffentliche IPv4- oder IPv6-Adresse besitzen. Während der automatisierten Erstkonfiguration darf sie über einen kontrollierten NAT-Zugang der Plattform-VM ausschließlich die für Installation und Image-Bezug notwendigen ausgehenden Verbindungen aufbauen. Nach Abschluss des Provisionings muss der ausgehende Internetzugriff gesperrt sein. Eingehend dürfen ausschließlich definierte Verbindungen von der privaten IP der Plattform-VM zugelassen werden. Der Testcode-Container besitzt keinen Netzwerkzugriff. |
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
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 md:p-8 backdrop-blur-md space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
          <Network className="h-3.5 w-3.5 text-zinc-300" />
          <span>Infrastruktur &amp; Sicherheits-Design</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Hetzner Cloud Zwei-VM-Architektur
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Live-Visualisierung der evaluierten Cloud-Topologie (Plattform-VM und isolierte Ausführungs-VM). 
          Unterstützt stufenlosen Zoom und wissenschaftlichen Multiformat-Export (SVG/PNG).
        </p>

        {/* Tab-Auswahl: Minimalist Segmented Control */}
        <div className="pt-2">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-950 border border-white/[0.08]">
            <button
              onClick={() => handleTabChange('diagram')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'diagram'
                  ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Topologie</span>
            </button>

            <button
              onClick={() => handleTabChange('sequence')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'sequence'
                  ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <GitCommit className="h-3.5 w-3.5" />
              <span>Sequenzablauf</span>
            </button>

            <button
              onClick={() => handleTabChange('docs')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Spezifikation (A1–A7)</span>
            </button>

            <button
              onClick={() => handleTabChange('benchmarks')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'benchmarks'
                  ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Benchmarks (K1–K5)</span>
            </button>
          </div>
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

          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 md:p-8 space-y-4 backdrop-blur-sm shadow-xl">
            <h3 className="text-base font-semibold text-white flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-zinc-400" />
              <span>Detailanalyse des Ausführungsablaufs (Anforderungen A2, A5 &amp; A6)</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
              Das Sequenzdiagramm dokumentiert den lückenlosen Lebenszyklus eines Testauftrags auf der isolierten Ausführungs-VM.
              Der Daemon verarbeitet jeden Auftrag strikt isoliert nach dem <em className="text-zinc-200">Least-Privilege-Prinzip</em>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-xl border border-white/[0.06] bg-zinc-950/60 space-y-2">
                <span className="text-[10px] font-mono font-medium text-zinc-300 uppercase bg-white/[0.05] px-2 py-0.5 rounded border border-white/10">
                  Schritt 1–2: Ingress &amp; Validierung
                </span>
                <h4 className="text-xs font-semibold text-white">Payload-Schutz &amp; Timing</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Pydantic prüft die Payload-Größe (max. 64 KB). Eine eindeutige Job-UUID wird vergeben und die Hochpräzisions-Zeitmessung gestartet.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.06] bg-zinc-950/60 space-y-2">
                <span className="text-[10px] font-mono font-medium text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Schritt 3–4: Sandbox-Lauf (A5)
                </span>
                <h4 className="text-xs font-semibold text-white">Isolation &amp; Timeout (max. 10s)</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Docker startet mit <code className="text-zinc-200 bg-white/5 px-1 py-0.5 rounded">--network none</code> als Non-Root (1000:1000). Bei Zeitüberschreitung greift der Timeout-Kill mit Exit-Code 124.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.06] bg-zinc-950/60 space-y-2">
                <span className="text-[10px] font-mono font-medium text-zinc-300 uppercase bg-white/[0.05] px-2 py-0.5 rounded border border-white/10">
                  Schritt 5–6: Egress &amp; Audit (A6)
                </span>
                <h4 className="text-xs font-semibold text-white">Cleanup &amp; Metriken</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Temporäre Verzeichnisse werden im <code className="text-zinc-200 bg-white/5 px-1 py-0.5 rounded">finally</code>-Block restlos gelöscht. Metadaten (stdout, stderr, exitCode, ms) gehen als JSON zurück.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Inhalt: MDX Dokumentation */}
      {activeTab === 'docs' && (
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 md:p-8 backdrop-blur-sm shadow-xl">
          <MdxRenderer content={ARCHITECTURE_DOC_MD} />
        </div>
      )}

      {/* Tab Inhalt: Benchmark & Messwerte Vergleich */}
      {activeTab === 'benchmarks' && (
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 md:p-8 backdrop-blur-sm shadow-xl">
          <BenchmarkComparison />
        </div>
      )}
    </div>
  );
};
