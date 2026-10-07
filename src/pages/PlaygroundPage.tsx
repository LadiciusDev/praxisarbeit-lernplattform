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
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
              <PlayCircle className="h-3.5 w-3.5 text-zinc-300" />
              <span>Interaktive Sandbox</span>
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">Code-Playground &amp; Testlabor</h1>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Teste beliebigen Code in <strong className="text-zinc-200">Python</strong>, <strong className="text-zinc-200">JavaScript</strong> oder <strong className="text-zinc-200">Java</strong>. 
              Inklusive automatischem IntelliSense, Syntax-Highlighting und direkter Sandbox-Isolation auf der Hetzner Cloud.
            </p>
          </div>

          {/* Vorlagen-Auswahl */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs text-zinc-400 font-mono">Vorlage:</span>
            <div className="inline-flex p-1 rounded-xl bg-zinc-950 border border-white/[0.08] gap-1">
              {currentTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTemplateSelect(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    templateIndex === idx
                      ? 'bg-white text-zinc-950 font-medium shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
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
