import type { LanguageMeta, SupportedLanguage } from '../types/lesson';

export const LANGUAGES_DATA: Record<SupportedLanguage, LanguageMeta> = {
  python: {
    id: 'python',
    name: 'Python',
    version: '3.11',
    color: '#38bdf8', // sky-400
    accentClass: 'text-sky-400',
    borderClass: 'border-sky-500/30',
    bgClass: 'bg-sky-500/10',
    description: 'Eine der beliebtesten und vielseitigsten Programmiersprachen weltweit – ideal für Data Science, Skripte und Web.',
    lessons: [
      {
        id: 'grundlagen',
        title: '1. Grundlagen & Variablen',
        shortDesc: 'Einführung in Variablen, Datentypen und die print()-Funktion.',
        language: 'python',
        explanation: `### Willkommen zu Python!
In Python musst du Datentypen nicht explizit deklarieren. Variablen werden dynamisch typisiert.

Mit der Funktion \`print()\` kannst du Ausgaben in der Konsole erzeugen. Formatierte Ausgaben erreichst du am einfachsten mit sogenannten **f-Strings** (\`f"..."\`).`,
        initialCode: `# Grundlagen in Python
name = "Praxisarbeit"
version = 1.0
is_active = True

print(f"Projekt: {name}")
print(f"Version: {version}")
print(f"Status aktiv: {is_active}")
print("Berechnung:", 15 + 27)
`,
        tips: [
          'Verwende f-Strings für lesbare Ausgaben mit Variablen.',
          'Python nutzt Einrückungen (Indentation) anstelle von geschweiften Klammern.'
        ],
        expectedOutput: 'Projekt: Praxisarbeit\nVersion: 1.0\nStatus aktiv: True\nBerechnung: 42'
      },
      {
        id: 'bedingungen',
        title: '2. Bedingungen & Logik',
        shortDesc: 'Entscheidungen treffen mit if, elif und else.',
        language: 'python',
        explanation: `### Verzweigungen in Python
Mit \`if\`, \`elif\` und \`else\` kannst du den Ablauf deines Programms anhand von Bedingungen steuern.

Vergleichsoperatoren:
* \`==\` (Gleichheit)
* \`!=\` (Ungleichheit)
* \`>\`, \`<\`, \`>=\`, \`<=\`
* Logische Verknüpfungen: \`and\`, \`or\`, \`not\``,
        initialCode: `# Bedingungen und Schwellenwerte
cpu_auslastung = 78

if cpu_auslastung >= 90:
    print("STATUS: KRITISCH - CPU überlastet!")
elif cpu_auslastung >= 75:
    print("STATUS: WARNUNG - Hohe Systemlast!")
else:
    print("STATUS: NORMAL - Alles im grünen Bereich.")
`,
        tips: [
          'Vergiss den Doppelpunkt : am Ende der if-Zeile nicht!',
          'Achte auf konsistente 4-Leerzeichen-Einrückung.'
        ],
        expectedOutput: 'STATUS: WARNUNG - Hohe Systemlast!'
      },
      {
        id: 'schleifen',
        title: '3. Schleifen & Iteration',
        shortDesc: 'Wiederholungen mit for-in und range() ausführen.',
        language: 'python',
        explanation: `### Schleifen in Python
Mit einer \`for\`-Schleife kannst du über Zahlenbereiche mit \`range()\` oder direkt über Elemente einer Liste iterieren.`,
        initialCode: `# Iteration über Server-Knoten
server_liste = ["plattform-vm", "ausfuehrung-vm", "backup-vm"]

print("--- Überprüfe Server-Status ---")
for index, server in enumerate(server_liste, start=1):
    print(f"Knoten {index}: {server} ist online")

print("\n--- Zählerschleife ---")
for i in range(1, 4):
    print(f"Heartbeat-Ping #{i} gesendet")
`,
        tips: [
          'enumerate() gibt dir sowohl den Index als auch das Element zurück.',
          'range(start, stop) zählt bis stop-1.'
        ],
        expectedOutput: '--- Überprüfe Server-Status ---\nKnoten 1: plattform-vm ist online\n...'
      }
    ]
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    version: 'Node.js 20',
    color: '#facc15', // yellow-400
    accentClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/30',
    bgClass: 'bg-yellow-500/10',
    description: 'Die Universalsprache des Webs – sowohl im Browser als auch serverseitig in Node.js unverzichtbar.',
    lessons: [
      {
        id: 'grundlagen',
        title: '1. Moderne Grundlagen',
        shortDesc: 'Verwendung von let, const und Template Literals.',
        language: 'javascript',
        explanation: `### JavaScript & Node.js Grundlagen
Im modernen JavaScript (ES6+) deklarierst du veränderbare Variablen mit \`let\` und unveränderliche Konstanten mit \`const\`.

Ausgaben erfolgen über \`console.log()\`. Mit Backticks (\`\`) kannst du dynamische **Template Literals** mit \`\${variable}\` nutzen.`,
        initialCode: `// Moderne JavaScript Grundlagen
const platform = "Hetzner Cloud";
let vmCount = 2;
const isIsolated = true;

console.log(\`Plattform: \${platform}\`);
console.log(\`Anzahl VMs im Setup: \${vmCount}\`);
console.log(\`Netzwerk-Isolation aktiv: \${isIsolated}\`);

// Dynamische Berechnung
console.log("Ergebnis:", (12 * 8) + 4);
`,
        tips: [
          'Bevorzuge const wann immer möglich.',
          'Template Strings erlauben mehrzeiligen Text und direkte Ausdrücke.'
        ],
        expectedOutput: 'Plattform: Hetzner Cloud\nAnzahl VMs im Setup: 2\n...'
      },
      {
        id: 'arrays',
        title: '2. Array-Transformationen',
        shortDesc: 'Funktionale Methoden wie map, filter und forEach nutzen.',
        language: 'javascript',
        explanation: `### Arrays & Transformationen
JavaScript bietet mächtige funktionale Methoden auf Arrays:
* \`.filter()\`: Selektiert Elemente anhand einer Bedingung
* \`.map()\`: Transformiert jedes Element in eine neue Form
* \`.forEach()\`: Führt eine Aktion für jedes Element aus`,
        initialCode: `// Server-Metriken filtern und verarbeiten
const serverPorts = [22, 80, 443, 3306, 8080, 5432];

// Nur öffentlich erlaubte Web-Ports filtern
const publicPorts = serverPorts.filter(port => port === 80 || port === 443);

console.log("Öffentlich freigegebene Ports:", publicPorts);

// Ports formatieren
const formatted = publicPorts.map(p => \`Port \${p}/TCP\`);
console.log("Dienste:", formatted.join(", "));
`,
        tips: [
          'filter() und map() verändern das Original-Array nicht, sondern liefern ein neues Array zurück.'
        ],
        expectedOutput: 'Öffentlich freigegebene Ports: [ 80, 443 ]\nDienste: Port 80/TCP, Port 443/TCP'
      },
      {
        id: 'funktionen',
        title: '3. Arrow Functions & Objekte',
        shortDesc: 'Kompakte Pfeilfunktionen und strukturierte JSON-Objekte.',
        language: 'javascript',
        explanation: `### Funktionen und JSON
Arrow Functions (\`() => {}\`) bieten eine kurze und prägnante Syntax für Funktionen. In Kombination mit JSON-Objekten strukturieren sie Daten ideal.`,
        initialCode: `// Ausführungs-Job simulieren
const createJob = (id, lang, memoryLimitMb) => ({
  id,
  language: lang,
  limits: {
    memory: \`\${memoryLimitMb}MB\`,
    timeoutSec: 5
  },
  createdAt: new Date().toISOString().split("T")[0]
});

const myJob = createJob("job-491", "javascript", 128);
console.log("Generierter Job-Auftrag:");
console.log(JSON.stringify(myJob, null, 2));
`,
        tips: [
          'Mit JSON.stringify(obj, null, 2) formatierst du Objekte mit Einrückung lesbar.'
        ],
        expectedOutput: 'Generierter Job-Auftrag:\n{\n  "id": "job-491", ...\n}'
      }
    ]
  },
  java: {
    id: 'java',
    name: 'Java',
    version: 'OpenJDK 21',
    color: '#fb923c', // orange-400
    accentClass: 'text-orange-400',
    borderClass: 'border-orange-500/30',
    bgClass: 'bg-orange-500/10',
    description: 'Objektorientierte, typensichere Enterprise-Sprache mit hoher Performance und robuster Typisierung.',
    lessons: [
      {
        id: 'grundlagen',
        title: '1. Klassen & Main-Methode',
        shortDesc: 'Der Einstiegspunkt in jedes Java-Programm.',
        language: 'java',
        explanation: `### Java Grundstruktur
Java ist strikt objektorientiert. Jeder Code muss sich innerhalb einer Klasse befinden. Der Einstiegspunkt jedes lauffähigen Programms ist die Methode:

\`public static void main(String[] args)\`

Konsolenausgaben erzeugst du mit \`System.out.println(...)\`.`,
        initialCode: `// Einfache Java-Klasse
public class Main {
    public static void main(String[] args) {
        System.out.println("Willkommen zu Java 21!");
        System.out.println("Sichere Codeausführungsumgebung initialisiert.");
        
        int zahl1 = 20;
        int zahl2 = 22;
        System.out.println("Summe: " + (zahl1 + zahl2));
    }
}
`,
        tips: [
          'Der Klassenname muss exakt mit dem Dateinamen (Main) übereinstimmen.',
          'Jeder Befehl in Java endet mit einem Semikolon (;).'
        ],
        expectedOutput: 'Willkommen zu Java 21!\nSichere Codeausführungsumgebung initialisiert.\nSumme: 42'
      },
      {
        id: 'datentypen',
        title: '2. Datentypen & String-Methoden',
        shortDesc: 'Arbeiten mit String, int, boolean und Arrays.',
        language: 'java',
        explanation: `### Statische Typisierung
Java überprüft Datentypen bereits beim Kompilieren:
* Primitive Typen: \`int\`, \`double\`, \`boolean\`, \`char\`
* Komplexe Typen: \`String\`, \`Arrays\` (\`String[]\`)`,
        initialCode: `public class Main {
    public static void main(String[] args) {
        String host = "plattform-vm.internal";
        int port = 8080;
        boolean isEncrypted = true;

        System.out.println("Ziel-Host: " + host.toUpperCase());
        System.out.println("Port: " + port);
        System.out.println("TLS aktiviert: " + isEncrypted);
        System.out.println("Host-Länge: " + host.length() + " Zeichen");
    }
}
`,
        tips: [
          'Strings sind in Java unveränderlich (immutable). Methoden wie toUpperCase() liefern einen neuen String.'
        ],
        expectedOutput: 'Ziel-Host: PLATTFORM-VM.INTERNAL\nPort: 8080\n...'
      },
      {
        id: 'kontrollstrukturen',
        title: '3. Schleifen & Verzweigungen',
        shortDesc: 'Kontrollfluss mit for-each und if-else gestalten.',
        language: 'java',
        explanation: `### Schleifen in Java
Mit der erweiterten \`for\`-Schleife (\`for-each\`) iterierst du unkompliziert durch Arrays und Collections.`,
        initialCode: `public class Main {
    public static void main(String[] args) {
        String[] languages = {"Python", "JavaScript", "Java"};

        System.out.println("Unterstützte Programmiersprachen:");
        for (String lang : languages) {
            System.out.println(" - " + lang + " (Sandbox aktiv)");
        }

        int exitCode = 0;
        if (exitCode == 0) {
            System.out.println("Status: Job erfolgreich abgeschlossen (Exit 0)");
        }
    }
}
`,
        tips: [
          'Verwende for(Typ element : array) für saubere Iterationen ohne Zählvariable.'
        ],
        expectedOutput: 'Unterstützte Programmiersprachen:\n - Python (Sandbox aktiv)\n...'
      }
    ]
  }
};
