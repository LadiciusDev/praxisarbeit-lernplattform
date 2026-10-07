import type { FC, ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'sky' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: FC<BadgeProps> = ({

  children,
  variant = 'slate',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    slate: 'bg-zinc-900 text-zinc-300 border-white/10',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
