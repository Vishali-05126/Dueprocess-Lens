import React from 'react';
import { AlertCircle, ShieldAlert, ArrowUpRight, Scale } from 'lucide-react';
import { UrgentReviewFlag } from '../../types';

interface SafetyBannerProps {
  urgentFlags?: UrgentReviewFlag[];
  compact?: boolean;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ urgentFlags = [], compact = false }) => {
  return (
    <aside aria-label="Legal information disclaimer" className="w-full space-y-3 mb-6 no-print">
      {/* Primary Civic Information Notice */}
      <div className="rounded-xl bg-[#111936]/80 border border-[#1E294B] px-4 py-3 flex items-start gap-3 text-xs text-[#8E98B7]">
        <Scale className="w-4 h-4 text-[#48D9E8] shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <span className="font-semibold text-[#F7F4ED] mr-1.5">Civic Information Notice:</span>
          DueProcess Lens provides general legal information and document organization. It does not provide legal advice, legal representation, or a prediction of whether an appeal will succeed. Users should consult a qualified lawyer or legal-aid organization for legal advice.
        </div>
      </div>

      {/* Urgent Review Flags if applicable */}
      {urgentFlags.length > 0 && (
        <div className="rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B6B]">
            <ShieldAlert className="w-4 h-4" />
            <span>Urgent Review Guidance Detected</span>
          </div>
          {urgentFlags.map((flag, idx) => (
            <div key={idx} className="text-xs text-[#F7F4ED]/90 pl-6 border-l-2 border-[#FF6B6B]/40 space-y-1">
              <p className="font-medium text-[#FF8585]">{flag.category}: {flag.description}</p>
              <p className="text-[#8E98B7] leading-relaxed">{flag.guidance}</p>
            </div>
          ))}
          <div className="text-[11px] text-[#FF8585] flex items-center gap-1 pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>If facing imminent deadlines or loss of essential benefits/housing, contact a qualified legal-aid organization immediately.</span>
          </div>
        </div>
      )}
    </aside>
  );
};
