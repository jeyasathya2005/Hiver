import React from 'react';

interface DemoBadgeProps {
  isDemo?: boolean;
  size?: 'sm' | 'md';
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ isDemo = true, size = 'sm' }) => {
  if (!isDemo) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 ${size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live API
      </span>
    );
  }

  return (
    <span
      title="This metric or response is generated from the curated Kaggle Twitter Support baseline demonstration set"
      className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Demo Dataset
    </span>
  );
};
