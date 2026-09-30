import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Download, Copy, Check, RefreshCw, ZoomIn, ZoomOut, AlertCircle, Sun, Moon, ChevronDown, Sparkles, Layers } from 'lucide-react';

export type MermaidDiagramSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export const SIZE_WIDTH_MAP: Record<MermaidDiagramSize, { label: string; width: string; desc: string }> = {
  sm: { label: 'S', width: '640px', desc: 'Klein (640px)' },
  md: { label: 'M', width: '880px', desc: 'Mittel (880px)' },
  lg: { label: 'L', width: '1150px', desc: 'Groß (1150px)' },
  xl: { label: 'XL', width: '1400px', desc: 'Sehr groß (1400px)' },
  '2xl': { label: '2XL', width: '1650px', desc: 'Maximal (1650px)' },
  full: { label: '100%', width: '100%', desc: 'Volle Breite (100%)' },
};

export interface MermaidViewerProps {
  chart: string;
  title?: string;
  defaultZoom?: number;
  defaultSize?: MermaidDiagramSize;
  size?: MermaidDiagramSize;
  maxWidth?: string;
  maxWidthClass?: string;
  minHeightClass?: string;
  showSizeSelector?: boolean;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  chart,
  title = 'Architektur-Diagramm',
  defaultZoom = 1.0,
  defaultSize = 'xl',
  size,
  maxWidth,
  minHeightClass = 'min-h-[220px]',
  showSizeSelector = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(defaultZoom);
  const [currentSize, setCurrentSize] = useState<MermaidDiagramSize>(size || defaultSize);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  useEffect(() => {
    setZoom(defaultZoom);
  }, [defaultZoom]);

  useEffect(() => {
    if (size) {
      setCurrentSize(size);
    }
  }, [size]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#020617',
        primaryColor: '#0284c7',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#38bdf8',
        lineColor: '#64748b',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '15px',
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 45,
        rankSpacing: 55,
        padding: 16,
      },
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      try {
        setError(null);
        const id = 'mermaid-' + Math.random().toString(36).substring(2, 9);
        const { svg } = await mermaid.render(id, chart);
        // Entfernt starre inline max-width Begrenzungen von Mermaid, damit die Grafik skalieren kann
        const responsiveSvg = svg.replace(/style="max-width:\s*[^;"]+;?"/g, 'style="width: 100%; height: auto;"');
        setSvgContent(responsiveSvg);
      } catch (err: unknown) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Rendern des Mermaid-Diagramms');
      }
    };

    renderChart();
  }, [chart]);

  // Export als SVG
  const handleExportSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  type ExportTheme = 'dark' | 'light' | 'transparent-dark' | 'transparent-light';

  // Export als hochauflösendes PNG für die Praxisarbeit (Dunkel, Weiß oder Transparent)
  const handleExportPng = (theme: ExportTheme = 'dark') => {
    if (!svgContent) return;

    const isLightColors = theme === 'light' || theme === 'transparent-light';
    const isTransparent = theme === 'transparent-dark' || theme === 'transparent-light';

    let exportSvg = svgContent;
    if (isLightColors) {
      const COLOR_MAP: Record<string, string> = {
        '#020617': '#f8fafc',
        '#0f172a': '#f1f5f9',
        '#1e293b': '#e2e8f0',
        '#f8fafc': '#0f172a',
        '#ffffff': '#0f172a',
        '#64748b': '#334155',
        '#38bdf8': '#0284c7',
        '#94a3b8': '#475569',
      };
      exportSvg = svgContent.replace(
        /#(?:020617|0f172a|1e293b|f8fafc|ffffff|64748b|38bdf8|94a3b8)\b/gi,
        (m) => COLOR_MAP[m.toLowerCase()] || m
      );
    }

    if (isTransparent) {
      // Stellt sicher, dass kein opakes Hintergrundrechteck von Mermaid die Transparenz überlagert
      exportSvg = exportSvg.replace(/<rect[^>]*class="[^"]*background[^"]*"[^>]*>/gi, (match) => {
        return match.replace(/fill="[^"]*"/, 'fill="none"');
      });
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(exportSvg, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    if (!svgElement) return;

    if (isTransparent) {
      svgElement.style.backgroundColor = 'transparent';
    }

    // Dimensionen extrahieren
    const viewBox = svgElement.getAttribute('viewBox');
    let width = 1200;
    let height = 800;

    if (viewBox) {
      const parts = viewBox.split(' ').map(Number);
      if (parts.length === 4) {
        width = parts[2] * 2; // 2x Skalierung für gestochen scharfen Druck
        height = parts[3] * 2;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([exportSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // 1. Hintergrund zeichnen (nur wenn nicht transparent freigestellt)
      if (!isTransparent) {
        if (theme === 'light') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.fillStyle = '#090d16';
          ctx.fillRect(0, 0, width, height);
        }
      }

      // 2. Titel im Export einblenden
      if (isLightColors) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText(title, 40, 50);

        ctx.fillStyle = '#475569';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Praxisarbeit: Hetzner Cloud Zwei-VM-Architektur (Terraform vs. OpenTofu)', 40, 80);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText(title, 40, 50);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Praxisarbeit: Hetzner Cloud Zwei-VM-Architektur (Terraform vs. OpenTofu)', 40, 80);
      }

      // 3. SVG zeichnen
      ctx.drawImage(img, 40, 110, width - 80, height - 140);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      const fileSuffix = theme === 'light'
        ? 'druckversion'
        : theme === 'dark'
        ? 'praesentation'
        : theme === 'transparent-dark'
        ? 'transparent-dunkel'
        : 'transparent-hell';
      downloadLink.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${fileSuffix}.png`;
      downloadLink.click();
      setShowExportMenu(false);
    };

    img.src = url;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resolvedMaxWidth = maxWidth || SIZE_WIDTH_MAP[currentSize]?.width || '1400px';

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Header mit Werkzeugleiste */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/90 bg-slate-950/80 px-4 py-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-white font-mono">{title}</span>
        </div>

        {/* Werkzeugleiste */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Größen-Auswahl */}
          {showSizeSelector && (
            <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-lg px-2 py-0.5 border border-slate-700/60">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Größe</span>
              <select
                value={currentSize}
                onChange={(e) => setCurrentSize(e.target.value as MermaidDiagramSize)}
                className="bg-transparent text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer py-0.5 pr-1"
                title="Standard-Größe des Diagramms einstellen"
              >
                <option value="sm" className="bg-slate-900 text-slate-200">S (640px)</option>
                <option value="md" className="bg-slate-900 text-slate-200">M (880px)</option>
                <option value="lg" className="bg-slate-900 text-slate-200">L (1150px)</option>
                <option value="xl" className="bg-slate-900 text-slate-200">XL (1400px)</option>
                <option value="2xl" className="bg-slate-900 text-slate-200">2XL (1650px)</option>
                <option value="full" className="bg-slate-900 text-slate-200">100% (Voll)</option>
              </select>
            </div>
          )}

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700/60 text-slate-300">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              className="p-1 hover:text-white transition-colors"
              title="Verkleinern"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoom(defaultZoom)}
              title={`Auf Standard (${Math.round(defaultZoom * 100)}%) zurücksetzen`}
              className="text-[10px] font-mono px-1.5 text-slate-300 hover:text-cyan-300 transition-colors font-semibold"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(3.0, Number((z + 0.1).toFixed(2))))}
              className="p-1 hover:text-white transition-colors"
              title="Vergrößern"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Copy Mermaid Code */}
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Mermaid-Quellcode kopieren"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Code</span>
          </button>

          {/* Download SVG Button */}
          <button
            onClick={handleExportSvg}
            disabled={!svgContent || !!error}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-40"
            title="Als SVG Vektordatei exportieren"
          >
            <Download className="h-3.5 w-3.5" />
            <span>SVG</span>
          </button>

          {/* Download PNG Menü (Dunkel oder Weiß für Druck) */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={!svgContent || !!error}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95 disabled:opacity-40"
              title="Grafik für Abschlussarbeit oder Präsentation exportieren"
            >
              <Download className="h-3.5 w-3.5" />
              <span>PNG Exportieren</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {showExportMenu && (
              <div
                ref={exportMenuRef}
                className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl z-50 text-xs space-y-1"
              >
                <div className="px-2.5 py-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                  Design-Variante wählen
                </div>

                <button
                  onClick={() => handleExportPng('light')}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors text-slate-200 hover:text-white group"
                >
                  <Sun className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                      Druckversion (Weiß)
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5 whitespace-normal break-words">
                      Reines Weiß, dunkle Schrift – ideal für den Ausdruck in PDF &amp; Word
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleExportPng('dark')}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors text-slate-200 hover:text-white group"
                >
                  <Moon className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      Präsentation (Dunkel)
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5 whitespace-normal break-words">
                      Eleganter dunkler Hintergrund für Bildschirme &amp; Folien
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleExportPng('transparent-dark')}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors text-slate-200 hover:text-white group"
                >
                  <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                      Transparent (Dunkles Design)
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5 whitespace-normal break-words">
                      Freigestellt ohne Hintergrund – helle Linien für dunkle Folien &amp; Web
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleExportPng('transparent-light')}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors text-slate-200 hover:text-white group"
                >
                  <Layers className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Transparent (Helles Design)
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5 whitespace-normal break-words">
                      Freigestellt ohne Hintergrund – dunkle Linien für weiße Seiten &amp; Word
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diagramm-Anzeigebereich */}
      <div className={`relative ${minHeightClass} p-6 md:p-8 flex items-center justify-center overflow-auto bg-slate-950/95`}>
        {error ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 max-w-md text-xs flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Mermaid Syntax-Fehler:</div>
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-rose-200">{error}</pre>
            </div>
          </div>
        ) : svgContent ? (
          <div
            ref={containerRef}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              maxWidth: resolvedMaxWidth,
              width: '100%',
            }}
            className="transition-all duration-150 flex items-center justify-center mx-auto [&>svg]:w-full [&>svg]:h-auto [&>svg_.node_rect]:rx-2 [&>svg_.node_polygon]:rx-2"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
            <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
            <span>Rendere Architektur-Diagramm...</span>
          </div>
        )}
      </div>
    </div>
  );
};
