import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

export function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            {/* Startseite */}
            <Route path="/" element={<HomePage />} />

            {/* Architektur & Mermaid-Export Unterseite */}
            <Route path="/architektur" element={<ArchitecturePage />} />

            {/* Lektions-Unterseiten: /lernen/:language/:lessonId */}
            <Route path="/lernen/:language/:lessonId" element={<LessonPage />} />

            {/* Weiterleitung bei Aufruf nur der Sprache (z. B. /lernen/python -> /lernen/python/grundlagen) */}
            <Route path="/lernen/:language" element={<LessonRedirect />} />

            {/* Freier Playground */}
            <Route path="/playground" element={<PlaygroundPage />} />


            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

// Hilfskomponente für automatische Weiterleitung auf die erste Lektion einer Sprache
function LessonRedirect() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  const language = segments[1] || 'python';
  return <Navigate to={`/lernen/${language}/grundlagen`} replace />;
}

export default App;
