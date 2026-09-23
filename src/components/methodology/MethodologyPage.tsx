import React from 'react';
import { Scale, CheckCircle2, AlertTriangle, HelpCircle, Clock, Compass, BookOpen, ShieldCheck, HeartHandshake, FileCheck } from 'lucide-react';
import { SafetyBanner } from '../common/SafetyBanner';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SafetyBanner />

      {/* Header */}
      <div className="border-b border-[#1E294B] pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#111936] text-[11px] text-[#48D9E8] font-medium border border-[#1E294B]">
          <span>Civic Technology Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#F7F4ED]">
          Our Auditing Methodology
        </h1>
        <p className="text-xs sm:text-sm text-[#8E98B7] leading-relaxed">
          DueProcess Lens evaluates institutional rejection notices against fundamental standards of administrative fairness and procedural clarity. Here is how our six-dimensional evaluation operates.
        </p>
      </div>

      {/* The 6 Dimensions Detailed */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif font-medium text-[#F7F4ED]">
          The Six Dimensions of Institutional Transparency
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* 1. Decision */}
          <div className="p-5 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2ECC9A]" />
              <h3 className="text-sm font-semibold text-[#F7F4ED]">1. Decision Outcome</h3>
            </div>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              <strong>Audit standard:</strong> Does the notice clearly and unequivocally state what action was taken? Rejections should never be buried under euphemisms like "we are concluding this application cycle" without clearly stating the formal denial.
            </p>
          </div>

          {/* 2. Reason */}
          <div className="p-5 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F4B942]" />
              <h3 className="text-sm font-semibold text-[#F7F4ED]">2. Stated Reasons</h3>
            </div>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              <strong>Audit standard:</strong> Are the specific factual criteria, benchmarks, or prerequisites articulated? Blanket formulas such as "did not meet eligibility requirements" fail the transparency standard because they hide whether an administrative calculation error occurred.
            </p>
          </div>

          {/* 3. Evidence */}
          <div className="p-5 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#FF6B6B]" />
              <h3 className="text-sm font-semibold text-[#F7F4ED]">3. Evidentiary Consideration</h3>
            </div>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              <strong>Audit standard:</strong> Does the decision identify the specific documents, transcripts, income declarations, or medical records that were reviewed? When evidence is not itemized, applicants cannot tell if vital attachments were overlooked or lost.
            </p>
          </div>

          {/* 4. Rule */}
          <div className="p-5 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#6857FF]" />
              <h3 className="text-sm font-semibold text-[#F7F4ED]">4. Governing Rule or Policy</h3>
            </div>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              <strong>Audit standard:</strong> Is a published policy code, catalog section, or regulatory guideline cited? Citing the governing rule ensures accountability and allows applicants to verify whether the institution followed its own published procedures.
            </p>
          </div>

          {/* 5. Deadline */}
          <div className="p-5 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B6B]" />
              <h3 className="text-sm font-semibold text-[#F7F4ED]">5. Deadline & Timeline Calculations</h3>
            </div>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              <strong>Audit standard:</strong> Is the appeal cutoff unambiguous? Ambiguous terms like "within 14 days of this notice" create procedural traps where recipients cannot know if the clock started upon printing, postmarking, or delivery.
            </p>
          </div>

          {/* 6. Review Path */}
          <div className="p-5 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#48D9E8]" />
              <h3 className="text-sm font-semibold text-[#F7F4ED]">6. Clarification, Review, & Appeal Path</h3>
            </div>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              <strong>Audit standard:</strong> Are the designated submission methods, email addresses, portal links, and required form codes provided? Mentioning a right to review without providing the channel effectively denies access to that review.
            </p>
          </div>
        </div>
      </div>

      {/* Civic Tech Philosophy */}
      <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4">
        <h2 className="text-lg font-serif font-medium text-[#F7F4ED] flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#2ECC9A]" />
          <span>Our Civic Tech Philosophy: Information Clarity, Not Legal Verdicts</span>
        </h2>
        <div className="space-y-3 text-xs text-[#8E98B7] leading-relaxed">
          <p>
            DueProcess Lens was built on the premise that clarity is a prerequisite for justice. Every year, millions of individuals receive life-altering automated or bureaucratic rejection notices for university admissions, financial aid, public benefits, housing, and insurance.
          </p>
          <p>
            Most recipients are left bewildered by institutional jargon and unstated standards. DueProcess Lens equips applicants to ask the right questions, organize their records, and approach institutional advisors or legal aid clinics with precision.
          </p>
        </div>
      </div>
    </div>
  );
};
