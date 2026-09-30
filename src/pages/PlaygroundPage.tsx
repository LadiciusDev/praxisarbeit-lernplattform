import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SupportedLanguage } from '../types/execution';
import { CodeRunner } from '../components/editor/CodeRunner';
import { PlayCircle } from 'lucide-react';
import { LANGUAGES_DATA } from '../data/lessonsData';


// Standard-Snippets für den Playground
const PLAYGROUND_TEMPLATES: Record<SupportedLanguage, { label: string; code: string }[]> = {
  python: [
    {
      label: 'Standard: System & Schleife',
      code: `# Python 3.11 Sandbox Test
import sys

print("=== Hetzner Cloud Sandbox ===")
print("Python Version:", sys.version.split()[0])

data = [x ** 2 for x in range(1, 6)]
print("Quadratzahlen:", data)
print("Berechnung erfolgreich abgeschlossen.")
`,
    },
    {
      label: 'Fehler-Test (Exit-Code 1)',
      code: `# Testfall: Laufzeitfehler für Fehlerprotokoll (A2)
print("Starte kritische Operation...")

# Division durch Null triggert einen stderr Output & Exit-Code 1
x = 10
y = 0
result = x / y
print("Ergebnis:", result)
`,
    },
  ],
  javascript: [
    {
      label: 'Standard: JSON & Map',
      code: `// Node.js 20 Sandbox Test
const platform = {
  name: "Hetzner Cloud",
  vms: ["plattform-vm", "ausfuehrung-vm"],
  status: "active"
};

console.log("=== Node.js Runtime ===");
console.log("Plattform:", platform.name);
console.log("Aktive Knoten:", platform.vms.join(" <-> "));

const numbers = [10, 20, 30, 40];
const doubled = numbers.map(n => n * 2);
console.log("Verdoppelte Werte:", doubled);
`,
    },
    {
      label: 'Fehler-Test (Exception)',
      code: `// Testfall: Uncaught Exception
console.log("Initialisiere Auftrag...");
throw new Error("Demonstrations-Fehler: Ungültiger Zugriffsversuch im Sandbox-Container!");
`,
    },
  ],
  java: [
    {
      label: 'Standard: Main-Klasse',
      code: `// Java 21 Sandbox Test
public class Main {
    public static void main(String[] args) {
        System.out.println("=== OpenJDK 21 Sandbox ===");
        System.out.println("Sichere Umgebung gestartet.");
        
        long summe = 0;
        for (int i = 1; i <= 100; i++) {
            summe += i;
        }
        System.out.println("Summe 1 bis 100: " + summe);
    }
}
`,
    },
    {
      label: 'Fehler-Test (Exception)',
      code: `// Testfall: Java Exception
public class Main {
    public static void main(String[] args) {
        System.out.println("Versuche Division durch Null...");
        int a = 42;
        int b = 0;
        int c = a / b;
        System.out.println("Ergebnis: " + c);
    }
}
`,
    },
  ],
};

export const PlaygroundPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLangParam = searchParams.get('lang') as SupportedLanguage;

  const [language, setLanguage] = useState<SupportedLanguage>(
    initialLangParam && initialLangParam in LANGUAGES_DATA ? initialLangParam : 'python'
  );

  const [templateIndex, setTemplateIndex] = useState(0);
  const currentTemplates = PLAYGROUND_TEMPLATES[language];
  const [currentCode, setCurrentCode] = useState(currentTemplates[0].code);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setSearchParams({ lang: newLang });
    setTemplateIndex(0);
    setCurrentCode(PLAYGROUND_TEMPLATES[newLang][0].code);
  };

  const handleTemplateSelect = (idx: number) => {
    setTemplateIndex(idx);
    setCurrentCode(currentTemplates[idx].code);
  };

  return (

    <div className="space-y-6">
      {/* Playground Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <PlayCircle className="h-4 w-4" />
              <span>Interaktive Sandbox</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Code-Playground &amp; Testlabor</h1>
            <p className="text-xs md:text-sm text-slate-400">
              Teste beliebigen Code in <strong>Python</strong>, <strong>JavaScript</strong> oder <strong>Java</strong>. 
              Inklusive automatischem IntelliSense, Syntax-Highlighting und Fehleranalyse.
            </p>
          </div>

          {/* Vorlagen-Auswahl */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Vorlage:</span>
            {currentTemplates.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => handleTemplateSelect(idx)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  templateIndex === idx
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor & Execution Engine mit Sprachauswahl */}
      <CodeRunner
        language={language}
        initialCode={currentCode}
        allowLanguageChange={true}
        onLanguageChange={handleLanguageChange}
        title="Playground Sandbox"
      />
    </div>
  );
};
