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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${langMeta.accentClass}`}>
                {langMeta.name} • Lektion {activeIndex + 1} von {langMeta.lessons.length}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-white mt-1">
                {activeLesson.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link
                  to={`/lernen/${currentLang}/${prevLesson.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Zurück</span>
                </Link>
              )}

              {nextLesson ? (
                <Link
                  to={`/lernen/${currentLang}/${nextLesson.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                >
                  <span className="hidden sm:inline">Weiter</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <Link
                  to="/playground"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all"
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
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/90 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <Lightbulb className="h-4 w-4" />
                <span>Wichtige Hinweise:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
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
