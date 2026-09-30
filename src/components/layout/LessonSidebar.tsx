import { NavLink, Link } from 'react-router-dom';
import type { LanguageMeta } from '../../types/lesson';
import { ChevronRight, PlayCircle, BookOpen } from 'lucide-react';

interface LessonSidebarProps {
  languageMeta: LanguageMeta;
  activeLessonId: string;
}

export const LessonSidebar = ({ languageMeta, activeLessonId }: LessonSidebarProps) => {

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Sprach-Kopfbereich */}
      <div className={`p-5 rounded-2xl border ${languageMeta.borderClass} ${languageMeta.bgClass} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${languageMeta.accentClass}`}>
            Lernbereich
          </span>
          <span className="text-xs font-mono bg-slate-900/80 px-2 py-0.5 rounded text-slate-300 border border-slate-700/50">
            {languageMeta.version}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">{languageMeta.name}</h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">{languageMeta.description}</p>

        <Link
          to={`/playground?lang=${languageMeta.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 px-3 py-2 text-xs font-medium text-slate-200 transition-colors"
        >
          <PlayCircle className="h-3.5 w-3.5 text-cyan-400" />
          <span>In Playground öffnen</span>
        </Link>
      </div>

      {/* Lektionen-Navigation */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
        <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Lerneinheiten</span>
        </div>

        <nav className="space-y-1">
          {languageMeta.lessons.map((lesson, idx) => {
            const isActive = lesson.id === activeLessonId;
            return (
              <NavLink
                key={lesson.id}
                to={`/lernen/${languageMeta.id}/${lesson.id}`}
                className={`group flex items-start gap-3 rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? 'bg-slate-800 border border-cyan-500/30 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isActive ? (
                    <div className="h-4 w-4 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    </div>
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] font-mono text-slate-400">
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold group-hover:text-white truncate">
                    {lesson.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {lesson.shortDesc}
                  </div>
                </div>

                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
