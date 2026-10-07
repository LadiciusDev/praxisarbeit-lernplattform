import type { SupportedLanguage } from '../../types/execution';
import { ChevronDown, Code2 } from 'lucide-react';

interface LanguageSelectProps {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
  disabled?: boolean;
}

const LANGUAGES: { id: SupportedLanguage; label: string; iconColor: string }[] = [
  { id: 'python', label: 'Python (3.11)', iconColor: 'text-sky-400' },
  { id: 'javascript', label: 'JavaScript (Node 20)', iconColor: 'text-yellow-400' },
  { id: 'java', label: 'Java (OpenJDK 21)', iconColor: 'text-orange-400' },
];

export const LanguageSelect = ({ value, onChange, disabled }: LanguageSelectProps) => {

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-white/10 px-3 py-1.5 shadow-xs">
        <Code2 className="h-4 w-4 text-zinc-400" />
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as SupportedLanguage)}
          className="appearance-none bg-transparent pr-6 text-xs font-medium font-mono text-zinc-200 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-zinc-950 text-zinc-100">
              {lang.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
      </div>
    </div>
  );
};
