import React from 'react';
import { Scale, ShieldAlert, HeartHandshake } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full border-t border-[#1E294B] bg-[#070B18] text-[#8E98B7] text-xs mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#6857FF] flex items-center justify-center">
                <Scale className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-serif font-medium text-[#F7F4ED]">DueProcess Lens</span>
            </div>
            <p className="text-xs leading-relaxed text-[#8E98B7] max-w-md">
              An AI transparency auditor for institutional and automated rejection decisions. Identifies missing reasons, evidence, rules, deadlines, and review paths to help you understand your notice and organize informed next steps.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#48D9E8] pt-1">
              <span>Don’t just receive a rejection. Understand it. Question it. Prepare your next step.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#F7F4ED] uppercase tracking-wider mb-3">Auditing Framework</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('methodology')} className="hover:text-[#48D9E8] transition-colors">
                  Six Transparency Dimensions
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('comparison')} className="hover:text-[#48D9E8] transition-colors">
                  Evidence Alignment Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('action')} className="hover:text-[#48D9E8] transition-colors">
                  Neutral Question Builder
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('demo')} className="hover:text-[#48D9E8] transition-colors">
                  Sample Decision Library
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#F7F4ED] uppercase tracking-wider mb-3">Civic Tech Ethics</h4>
            <div className="p-3 rounded-lg bg-[#111936] border border-[#1E294B] space-y-2">
              <div className="flex items-center gap-1.5 text-[#F4B942] font-medium text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Strict Non-Legal Advice</span>
              </div>
              <p className="text-[11px] leading-normal text-[#8E98B7]">
                We do not predict appeal outcomes, replace qualified legal counsel, or assess whether decisions are lawful. Always verify with official authorities.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1E294B]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-[#8E98B7]/80">
            DueProcess Lens provides general legal information and document organization. It is not a law firm, does not provide legal advice, and does not predict case outcomes.
          </p>
          <div className="flex items-center gap-4 shrink-0 text-[#8E98B7]/80">
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-[#2ECC9A]" />
              <span>Open Civic Technology</span>
            </span>
            <span>·</span>
            <span>Zero-Retention Workspace</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
