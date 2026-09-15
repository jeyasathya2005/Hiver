import React from 'react';
import { DecisionType, RiskLevel } from '../../types/api';
import { CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface DecisionBadgeProps {
  decision: DecisionType;
  riskLevel?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showRisk?: boolean;
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({
  decision,
  riskLevel = 'LOW',
  size = 'md',
  showRisk = true
}) => {
  const isAutoHandle = decision === 'AUTO_HANDLE';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5 font-bold tracking-wide'
  };

  const riskColors: Record<RiskLevel, string> = {
    LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse'
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`inline-flex items-center rounded-lg border font-semibold tracking-tight transition-all ${sizeClasses[size]} ${
          isAutoHandle
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-950/50'
            : 'bg-amber-950/80 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-950/50'
        }`}
      >
        {isAutoHandle ? (
          <>
            <ShieldCheck className={size === 'lg' ? 'w-5 h-5 text-emerald-400' : 'w-4 h-4 text-emerald-400'} />
            <span>AUTO-HANDLE</span>
          </>
        ) : (
          <>
            <ShieldAlert className={size === 'lg' ? 'w-5 h-5 text-amber-400' : 'w-4 h-4 text-amber-400'} />
            <span>HUMAN ESCALATION</span>
          </>
        )}
      </div>

      {showRisk && riskLevel && (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${riskColors[riskLevel]}`}
        >
          {riskLevel === 'LOW' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {riskLevel} RISK
        </span>
      )}
    </div>
  );
};
