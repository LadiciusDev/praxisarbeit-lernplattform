import { useParams, Navigate, Link } from 'react-router-dom';
import { LANGUAGES_DATA } from '../data/lessonsData';
import type { SupportedLanguage } from '../types/execution';
import { LessonSidebar } from '../components/layout/LessonSidebar';
import { CodeRunner } from '../components/editor/CodeRunner';
import { MdxRenderer } from '../components/common/MdxRenderer';
import { ChevronLeft, ChevronRight, Lightbulb, ArrowRight } from 'lucide-react';


export const LessonPage = () => {

  const { language, lessonId } = useParams<{ language: string; lessonId: string }>();

  // Validierung der Sprache
  if (!language || !(language in LANGUAGES_DATA)) {
    return <Navigate to="/" replace />;
  }

  const currentLang = language as SupportedLanguage;
  const langMeta = LANGUAGES_DATA[currentLang];

  // Aktuelle Lektion ermitteln oder Standard zur ersten Lektion
  const currentLessonIndex = langMeta.lessons.findIndex((l) => l.id === lessonId);
  const activeIndex = currentLessonIndex !== -1 ? currentLessonIndex : 0;
  const activeLesson = langMeta.lessons[activeIndex];

  const prevLesson = activeIndex > 0 ? langMeta.lessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < langMeta.lessons.length - 1 ? langMeta.lessons[activeIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Linke Seitenleiste: Unterseiten der Sprache */}
      <LessonSidebar languageMeta={langMeta} activeLessonId={activeLesson.id} />

      {/* Hauptbereich: Erklärung + Fester Code-Editor */}
      <div className="flex-1 w-full space-y-6">
        {/* Lektions-Erklärung */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 md:p-8 backdrop-blur-sm space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <span className={`text-xs font-mono font-medium uppercase tracking-wider ${langMeta.accentClass}`}>
                {langMeta.name} • Lektion {activeIndex + 1} von {langMeta.lessons.length}
              </span>
              <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight mt-1">
                {activeLesson.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  to={`/lernen/${currentLang}/${prevLesson.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900/80 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Zurück</span>
                </Link>
              )}

              {nextLesson ? (
                <Link
                  to={`/lernen/${currentLang}/${nextLesson.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="hidden sm:inline">Weiter</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <Link
                  to="/playground"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Zum Playground</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Text-Erklärung mit MDX / Markdown Unterstützung */}
          <MdxRenderer content={activeLesson.explanation} />


          {/* Tipps & Erwartetes Ergebnis */}
          {activeLesson.tips && activeLesson.tips.length > 0 && (
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-zinc-950/60 p-4 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium mb-1">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span>Wichtige Hinweise:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-1">
                {activeLesson.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Fester Code-Editor (ohne Sprachauswahl, da Sprache fest ist) */}
        <CodeRunner
          language={currentLang}
          initialCode={activeLesson.initialCode}
          allowLanguageChange={false}
          title={`${langMeta.name} Ausführungsumgebung`}
        />
      </div>
    </div>
  );
};
