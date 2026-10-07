import { NavLink, Link } from 'react-router-dom';
import type { LanguageMeta } from '../../types/lesson';
import { ChevronRight, PlayCircle, BookOpen } from 'lucide-react';

interface LessonSidebarProps {
  languageMeta: LanguageMeta;
  activeLessonId: string;
}

export const LessonSidebar = ({ languageMeta, activeLessonId }: LessonSidebarProps) => {

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-5">
      {/* Sprach-Kopfbereich */}
      <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-mono font-medium uppercase tracking-wider ${languageMeta.accentClass}`}>
            Lernbereich
          </span>
          <span className="text-xs font-mono bg-zinc-950 px-2 py-0.5 rounded text-zinc-400 border border-white/10">
            {languageMeta.version}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-white tracking-tight mb-1">{languageMeta.name}</h2>
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">{languageMeta.description}</p>

        <Link
          to={`/playground?lang=${languageMeta.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/[0.08] px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <PlayCircle className="h-3.5 w-3.5 text-zinc-400" />
          <span>In Playground öffnen</span>
        </Link>
      </div>

      {/* Lektionen-Navigation */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-3.5 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
          <span>Lerneinheiten</span>
        </div>

        <nav className="space-y-1">
          {languageMeta.lessons.map((lesson, idx) => {
            const isActive = lesson.id === activeLessonId;
            return (
              <NavLink
                key={lesson.id}
                to={`/lernen/${languageMeta.id}/${lesson.id}`}
                className={`group flex items-start gap-3 rounded-xl p-2.5 text-left transition-all ${
                  isActive
                    ? 'bg-white/10 border border-white/15 text-white shadow-xs'
                    : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isActive ? (
                    <div className="h-4 w-4 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-400">
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium group-hover:text-white truncate">
                    {lesson.title}
                  </div>
                  <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                    {lesson.shortDesc}
                  </div>
                </div>

                <ChevronRight
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isActive ? 'text-zinc-300 translate-x-0.5' : 'text-zinc-600 group-hover:text-zinc-400'
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
