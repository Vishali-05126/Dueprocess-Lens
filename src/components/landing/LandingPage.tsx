import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, HelpCircle, FileText, Search, ShieldCheck, Sparkles, Scale, Clock, Compass, FileCheck } from 'lucide-react';

interface LandingPageProps {
  onStartAudit: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAudit, onExploreDemo }) => {
  return (
    <div className="w-full space-y-24 py-8">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-4 pb-12">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#6857FF]/15 via-[#48D9E8]/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111936] border border-[#1E294B] text-[11px] text-[#48D9E8] font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC9A] animate-pulse" />
                <span>Six-point transparency audit</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F7F4ED] tracking-tight leading-[1.12]">
                Every decision deserves an <span className="italic underline decoration-[#6857FF]/50 underline-offset-8">explanation</span>.
              </h1>

              <p className="text-base sm:text-lg text-[#8E98B7] leading-relaxed max-w-xl font-normal">
                DueProcess Lens reads rejection notices and reveals what they explain, what they leave unclear, and what you can prepare next.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartAudit}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#6857FF] to-[#5143E0] hover:from-[#7869FF] hover:to-[#6052F0] rounded-xl shadow-lg shadow-[#6857FF]/25 hover:shadow-[#6857FF]/40 transition-all flex items-center gap-2 group active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#48D9E8]" />
                  <span>Analyze a decision</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onExploreDemo}
                  className="px-5 py-3.5 text-sm font-medium text-[#F7F4ED] bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] hover:border-[#2D3C6E] rounded-xl transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#8E98B7]" />
                  <span>Explore an example</span>
                </button>
              </div>

              {/* Trust note */}
              <div className="flex items-center gap-2 text-xs text-[#8E98B7] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#2ECC9A]" />
                <span>AI-assisted information tool · General legal information · Not legal advice</span>
              </div>
            </div>

            {/* Right Hero Visual: Stylized Rejection Notice + Glowing Transparency Map */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl bg-[#0F162E] border border-[#1E294B] p-5 shadow-2xl shadow-black/60 overflow-hidden">
                {/* Simulated scanning beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#48D9E8] to-transparent opacity-75 blur-xs animate-[bounce_5s_ease-in-out_infinite]" />

                <div className="flex items-center justify-between pb-4 border-b border-[#1E294B] mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F4B942]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2ECC9A]" />
                    <span className="text-xs text-[#8E98B7] font-mono ml-2">AUDIT // REALTIME LENS</span>
                  </div>
                  <span className="text-[11px] text-[#48D9E8] bg-[#48D9E8]/10 px-2 py-0.5 rounded border border-[#48D9E8]/20">
                    Live Transparency Map
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Mini stylized notice */}
                  <div className="rounded-xl bg-[#F7F4ED] p-4 text-[#121826] font-mono text-[11px] leading-relaxed shadow-inner space-y-2 select-none relative overflow-hidden">
                    <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200 pb-1">
                      Admissions Committee Notice
                    </div>
                    <div className="text-stone-800 font-medium">Re: Application Declined</div>
                    <p className="text-stone-600">
                      We regret to inform you that your application was unsuccessful.
                      <span className="bg-[#F4B942]/25 px-1 py-0.5 rounded border-b border-[#F4B942] font-semibold text-stone-900 block my-1">
                        "Your application did not meet the eligibility requirements."
                      </span>
                      An appeal may be lodged within 14 days of this notice.
                    </p>
                    <div className="pt-2 text-[9px] text-stone-600 flex justify-between">
                      <span>Ref: SCH-2025-9921</span>
                      <span className="text-[#FF6B6B] font-semibold">14-day clock active</span>
                    </div>
                  </div>

                  {/* Right: 6 connected transparency nodes */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-[#8E98B7] uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Six Dimensions</span>
                      <span className="text-[#2ECC9A]">4 of 6 Identified</span>
                    </div>

                    {/* Node 1: Decision */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111936] border border-[#2ECC9A]/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2ECC9A]" />
                        <span className="text-xs text-[#F7F4ED] font-medium">1. Decision</span>
                      </div>
                      <span className="text-[10px] text-[#2ECC9A] font-mono font-medium">Clear</span>
                    </div>

                    {/* Node 2: Reason */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111936] border border-[#F4B942]/40 bg-[#F4B942]/5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F4B942]" />
                        <span className="text-xs text-[#F7F4ED] font-medium">2. Reason</span>
                      </div>
                      <span className="text-[10px] text-[#F4B942] font-mono font-medium">Vague</span>
                    </div>

                    {/* Node 3: Evidence */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111936] border border-[#FF6B6B]/30">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-[#FF6B6B]" />
                        <span className="text-xs text-[#F7F4ED] font-medium">3. Evidence</span>
                      </div>
                      <span className="text-[10px] text-[#FF6B6B] font-mono font-medium">Missing</span>
                    </div>

                    {/* Node 4: Rule */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111936] border border-[#F4B942]/40 bg-[#F4B942]/5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F4B942]" />
                        <span className="text-xs text-[#F7F4ED] font-medium">4. Rule</span>
                      </div>
                      <span className="text-[10px] text-[#F4B942] font-mono font-medium">Unclear</span>
                    </div>

                    {/* Node 5: Deadline */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111936] border border-[#FF6B6B]/40 bg-[#FF6B6B]/5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#FF6B6B]" />
                        <span className="text-xs text-[#F7F4ED] font-medium">5. Deadline</span>
                      </div>
                      <span className="text-[10px] text-[#FF6B6B] font-mono font-medium">Ambiguous</span>
                    </div>

                    {/* Node 6: Review Path */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#111936] border border-[#F4B942]/40 bg-[#F4B942]/5">
                      <div className="flex items-center gap-2">
                        <Compass className="w-3.5 h-3.5 text-[#F4B942]" />
                        <span className="text-xs text-[#F7F4ED] font-medium">6. Review Path</span>
                      </div>
                      <span className="text-[10px] text-[#F4B942] font-mono font-medium">Incomplete</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E294B] flex items-center justify-between text-xs text-[#8E98B7]">
                  <span>Communication clarity score: <strong className="text-[#F4B942]">54 / 100</strong></span>
                  <span className="text-[#48D9E8] hover:underline cursor-pointer" onClick={onExploreDemo}>
                    View full transparency map →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F7F4ED]">
            A rejection is often only the beginning of the confusion.
          </h2>
          <p className="text-sm text-[#8E98B7] leading-relaxed">
            Institutional letters routinely deliver life-altering decisions through generic boilerplates, omitted regulations, and uncalculated deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Problem Card 1 */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4 hover:border-[#6857FF]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#F4B942]/10 border border-[#F4B942]/20 flex items-center justify-center text-[#F4B942]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#F7F4ED]">The reason is vague</h3>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              Notices frequently claim "you did not meet eligibility requirements" without explaining which prerequisite failed, what calculations were run, or what transcript metrics were disqualified.
            </p>
            <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-[11px] font-mono text-stone-300 italic">
              "Your application did not satisfy departmental criteria for admission."
            </div>
          </div>

          {/* Problem Card 2 */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4 hover:border-[#6857FF]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center text-[#FF6B6B]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#F7F4ED]">The deadline is hidden</h3>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              Phrases like "within 14 days of this notice" or "within 30 days" leave the recipient uncertain: does the clock start on dispatch, postmark, or delivery? Are they business or calendar days?
            </p>
            <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-[11px] font-mono text-stone-300 italic">
              "Any request for reconsideration must be lodged within 14 days of notice."
            </div>
          </div>

          {/* Problem Card 3 */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4 hover:border-[#6857FF]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#48D9E8]/10 border border-[#48D9E8]/20 flex items-center justify-center text-[#48D9E8]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#F7F4ED]">The next step is unclear</h3>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              Decisions mention an "appeal" or "hearing" but fail to state the contact email, required form code, office address, or permissible procedural grounds for review.
            </p>
            <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-[11px] font-mono text-stone-300 italic">
              "You may appeal to the Faculty Board." (No address, portal, or form provided)
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111936] text-[11px] text-[#48D9E8] font-medium border border-[#1E294B]">
            <span>Four-step workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#F7F4ED]">
            Diagnosis is only half the journey.
          </h2>
          <p className="text-sm text-[#8E98B7]">
            Once unclear information is identified, build a neutral checklist of documents, questions, and official processes to investigate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-3">
            <span className="text-3xl font-serif text-[#6857FF] font-medium">01</span>
            <h3 className="text-base font-serif font-medium text-[#F7F4ED]">Upload & Redact</h3>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              Paste or upload your notice. Use our client-side redaction tool to black out sensitive identifiers before analysis begins.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-3">
            <span className="text-3xl font-serif text-[#48D9E8] font-medium">02</span>
            <h3 className="text-base font-serif font-medium text-[#F7F4ED]">Understand</h3>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              Our auditor maps the document into six legal clarity dimensions: Decision, Reason, Evidence, Rule, Deadline, and Review Path.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-3">
            <span className="text-3xl font-serif text-[#F4B942] font-medium">03</span>
            <h3 className="text-base font-serif font-medium text-[#F7F4ED]">Identify Gaps</h3>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              Highlight exact clauses. Understand why omitted criteria, ambiguous deadlines, or unitemized evidence matter to your case.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-3">
            <span className="text-3xl font-serif text-[#2ECC9A] font-medium">04</span>
            <h3 className="text-base font-serif font-medium text-[#F7F4ED]">Prepare Next Steps</h3>
            <p className="text-xs text-[#8E98B7] leading-relaxed">
              Generate fact-focused clarification questions, build an evidence checklist, and export a professional case file.
            </p>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0F162E] border border-[#1E294B] p-8 sm:p-12">
          <div className="max-w-2xl mb-8 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#F7F4ED]">
              Not a chatbot. Not a legal verdict.
            </h2>
            <p className="text-xs sm:text-sm text-[#8E98B7] leading-relaxed">
              DueProcess Lens does not predict outcomes or replace lawyers. It audits the clarity and completeness of decision communications and helps users organize verified information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Generic legal chatbot */}
            <div className="rounded-xl bg-[#070B18] border border-[#1E294B] p-6 space-y-4">
              <div className="flex items-center gap-2 text-stone-400 font-medium text-xs">
                <span className="w-2 h-2 rounded-full bg-stone-500" />
                <span>Generic Legal Chatbot</span>
              </div>
              <ul className="space-y-3 text-xs text-[#8E98B7]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FF6B6B]">✕</span>
                  <span>Answers broad, conversational questions without grounding</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FF6B6B]">✕</span>
                  <span>May hallucinate legal statutes or appeal outcomes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FF6B6B]">✕</span>
                  <span>Does not analyze a specific document structure or verbatim quotes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FF6B6B]">✕</span>
                  <span>Leaves you with unstructured walls of text</span>
                </li>
              </ul>
            </div>

            {/* DueProcess Lens */}
            <div className="rounded-xl bg-[#111936] border border-[#6857FF]/40 p-6 space-y-4 shadow-lg shadow-[#6857FF]/10">
              <div className="flex items-center gap-2 text-[#48D9E8] font-medium text-xs">
                <Scale className="w-4 h-4 text-[#6857FF]" />
                <span>DueProcess Lens Transparency Auditor</span>
              </div>
              <ul className="space-y-3 text-xs text-[#F7F4ED]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Analyzes your actual notice with strict document citation</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Audits reason, evidence, rule, deadline, and review path</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Pinpoints ambiguous deadlines and unitemized evaluation records</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A] shrink-0" />
                  <span>Generates neutral, fact-based clarification requests and evidence checklists</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* QUALITATIVE IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-8 space-y-2">
            <span className="text-2xl sm:text-3xl font-serif text-[#48D9E8]">One decision</span>
            <p className="text-xs text-[#8E98B7]">Clear parsing of what was formally decided and who decided it.</p>
          </div>
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-8 space-y-2">
            <span className="text-2xl sm:text-3xl font-serif text-[#6857FF]">Six dimensions</span>
            <p className="text-xs text-[#8E98B7]">Comprehensive audit of reason, evidence, rule, deadline, and appeal route.</p>
          </div>
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-8 space-y-2">
            <span className="text-2xl sm:text-3xl font-serif text-[#2ECC9A]">One actionable report</span>
            <p className="text-xs text-[#8E98B7]">Evidence-gathering checklist and draft factual clarification inquiries.</p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-6 pb-12">
        <h2 className="text-3xl sm:text-4xl font-serif text-[#F7F4ED]">
          See what your decision leaves unsaid.
        </h2>
        <p className="text-sm text-[#8E98B7] max-w-xl mx-auto leading-relaxed">
          DueProcess Lens does not tell you who is right. It helps you see what was explained, what was not, and how to prepare informed next steps.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartAudit}
            className="px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#6857FF] to-[#5143E0] hover:from-[#7869FF] hover:to-[#6052F0] rounded-xl shadow-lg shadow-[#6857FF]/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#48D9E8]" />
            <span>Audit a Rejection Notice</span>
          </button>
          <button
            onClick={onExploreDemo}
            className="px-6 py-3.5 text-sm font-medium text-[#F7F4ED] bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] rounded-xl transition-all"
          >
            <span>Explore Fictional Demo Notices</span>
          </button>
        </div>
      </section>
    </div>
  );
};
