import React, { useState, useEffect } from 'react';
import { SAMPLE_NOTICES, SampleNotice } from '../../data/sampleNotices';
import { TransparencyReportData } from '../../types';
import { CheckCircle2, AlertTriangle, HelpCircle, Clock, Compass, BookOpen, ArrowRight, Play, RefreshCw, FileText, Check, Sparkles } from 'lucide-react';

interface ProductDemoPageProps {
  onLoadReport: (report: TransparencyReportData, sampleId: string) => void;
  onNavigateToReport: () => void;
  onNavigateToAction: () => void;
}

export const ProductDemoPage: React.FC<ProductDemoPageProps> = ({ onLoadReport, onNavigateToReport, onNavigateToAction }) => {
  const [selectedSample, setSelectedSample] = useState<SampleNotice>(SAMPLE_NOTICES[0]);
  const [isSimulatingAudit, setIsSimulatingAudit] = useState(false);
  const [auditStep, setAuditStep] = useState(6); // default full reveal
  const [selectedHighlightQuote, setSelectedHighlightQuote] = useState<string>('');

  const auditStages = [
    'Scanning document structure & letterhead...',
    'Identifying formal decision outcome...',
    'Evaluating specificity of stated reasons...',
    'Searching for referenced evidence & transcripts...',
    'Detecting timelines, calculation rules & deadlines...',
    'Verifying official review routes & instructions...'
  ];

  const handleSelectSample = (sample: SampleNotice) => {
    setSelectedSample(sample);
    setSelectedHighlightQuote('');
    setIsSimulatingAudit(true);
    setAuditStep(0);
  };

  useEffect(() => {
    if (isSimulatingAudit && auditStep < auditStages.length) {
      const timer = setTimeout(() => {
        setAuditStep(prev => prev + 1);
      }, 450);
      return () => clearTimeout(timer);
    } else if (isSimulatingAudit && auditStep >= auditStages.length) {
      setIsSimulatingAudit(false);
    }
  }, [isSimulatingAudit, auditStep]);

  const report = selectedSample.report;
  const audit = report.transparency_audit;

  const handleOpenInWorkspace = () => {
    onLoadReport(report, selectedSample.id);
    onNavigateToReport();
  };

  const handleOpenActionPlan = () => {
    onLoadReport(report, selectedSample.id);
    onNavigateToAction();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E294B] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111936] text-[11px] text-[#48D9E8] font-medium border border-[#1E294B] mb-2">
            <span>Interactive Demo Library</span>
          </div>
          <h1 className="text-3xl font-serif font-normal text-[#F7F4ED]">
            Experience a Decision Audit
          </h1>
          <p className="text-xs sm:text-sm text-[#8E98B7] mt-1 max-w-2xl">
            Select a fictional sample document to watch DueProcess Lens audit the text, identify vague criteria or hidden deadlines, and build a response checklist.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsSimulatingAudit(true);
              setAuditStep(0);
            }}
            className="px-3.5 py-2 text-xs font-medium text-[#F7F4ED] bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingAudit ? 'animate-spin text-[#48D9E8]' : 'text-[#8E98B7]'}`} />
            <span>Re-run Audit Scanner</span>
          </button>

          <button
            onClick={handleOpenInWorkspace}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#6857FF] to-[#5143E0] hover:from-[#7869FF] hover:to-[#6052F0] rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#48D9E8]" />
            <span>Open in Full Workspace</span>
          </button>
        </div>
      </div>

      {/* Sample Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SAMPLE_NOTICES.map(sample => {
          const isSelected = selectedSample.id === sample.id;
          return (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`p-4 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'bg-[#111936] border-[#6857FF] shadow-lg shadow-[#6857FF]/10'
                  : 'bg-[#0F162E] border-[#1E294B] hover:border-[#2D3C6E]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-[#8E98B7] mb-1.5 font-mono">
                <span>{sample.category}</span>
                <span className="text-[#F4B942]">Score: {sample.report.clarity_score}/100</span>
              </div>
              <h3 className="text-sm font-semibold text-[#F7F4ED] mb-1">{sample.title}</h3>
              <p className="text-xs text-[#8E98B7] line-clamp-2 leading-relaxed">
                {sample.subtitle}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-[#48D9E8]">
                <span>{isSelected ? 'Currently Viewing' : 'Try this example'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulated Live Scanner Progress Bar */}
      {isSimulatingAudit && (
        <div className="rounded-xl bg-[#111936] border border-[#48D9E8]/40 p-4 space-y-2 animate-pulse">
          <div className="flex items-center justify-between text-xs text-[#48D9E8]">
            <span className="font-mono flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              {auditStages[auditStep] || 'Finalizing audit findings...'}
            </span>
            <span className="font-mono">{Math.min(100, Math.round(((auditStep + 1) / auditStages.length) * 100))}%</span>
          </div>
          <div className="w-full bg-[#070B18] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6857FF] to-[#48D9E8] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round(((auditStep + 1) / auditStages.length) * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Side-by-Side: Original Document vs Transparency Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Original Decision Document (Parchment Paper) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#8E98B7]">
              <FileText className="w-4 h-4 text-[#48D9E8]" />
              <span className="font-medium text-[#F7F4ED]">Original Notice Document</span>
              <span>·</span>
              <span className="text-[11px] text-[#F4B942]">Fictional Demo</span>
            </div>
            <span className="text-[11px] text-[#8E98B7]">Click findings on right to trace text</span>
          </div>

          <div className="parchment-surface rounded-2xl p-6 sm:p-8 font-serif leading-relaxed text-[#121826] relative select-text border border-stone-300 shadow-2xl">
            {/* Watermark badge */}
            <div className="text-[10px] uppercase font-mono tracking-widest text-stone-500 border-b border-stone-300 pb-2 mb-4 flex justify-between items-center">
              <span>{selectedSample.institution}</span>
              <span>CONFIDENTIAL // NOTICE</span>
            </div>

            <pre className="font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed font-normal">
              {selectedSample.rawText.split('\n').map((line, i) => {
                const isHighlighted = selectedHighlightQuote && line.toLowerCase().includes(selectedHighlightQuote.toLowerCase().slice(0, 30));
                return (
                  <span
                    key={i}
                    className={`block transition-colors ${
                      isHighlighted
                        ? 'bg-[#F4B942]/40 text-stone-950 font-semibold px-1 py-0.5 rounded shadow-xs'
                        : ''
                    }`}
                  >
                    {line}
                  </span>
                );
              })}
            </pre>

            <div className="mt-8 pt-4 border-t border-stone-300 text-[10px] font-mono text-stone-600 flex justify-between">
              <span>Fictional sample notice for evaluation</span>
              <span>DueProcess Lens Civic Tech</span>
            </div>
          </div>
        </div>

        {/* Right: Extracted Transparency Report */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-[#F7F4ED]">Extracted Transparency Audit</span>
              <span>·</span>
              <span className="text-[#8E98B7]">Communication Clarity:</span>
              <strong className="text-[#F4B942] font-mono text-sm">{report.clarity_score}/100</strong>
            </div>
            <button
              onClick={handleOpenActionPlan}
              className="text-xs text-[#48D9E8] hover:underline flex items-center gap-1"
            >
              <span>View Action Checklist</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* 6 Audit Elements Grid */}
          <div className="space-y-3">
            {/* 1. Decision */}
            <div
              onClick={() => setSelectedHighlightQuote(audit.decision.quote)}
              className="p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] hover:border-[#2ECC9A]/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC9A]" />
                  <span className="text-xs font-semibold text-[#F7F4ED]">1. Decision</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#2ECC9A]/10 text-[#2ECC9A] border border-[#2ECC9A]/20">
                  {audit.decision.status}
                </span>
              </div>
              <p className="text-xs text-[#8E98B7] leading-relaxed">
                {audit.decision.explanation}
              </p>
              {audit.decision.quote && (
                <div className="text-[11px] font-mono text-[#F7F4ED]/80 bg-[#070B18] p-2 rounded border border-[#1E294B] group-hover:border-[#2ECC9A]/30">
                  "{audit.decision.quote}"
                </div>
              )}
            </div>

            {/* 2. Reason */}
            <div
              onClick={() => setSelectedHighlightQuote(audit.reason.quote)}
              className="p-4 rounded-xl bg-[#0F162E] border border-[#F4B942]/40 bg-[#F4B942]/5 hover:border-[#F4B942] transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F4B942]" />
                  <span className="text-xs font-semibold text-[#F7F4ED]">2. Reason</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F4B942]/10 text-[#F4B942] border border-[#F4B942]/30">
                  {audit.reason.status}
                </span>
              </div>
              <p className="text-xs text-[#8E98B7] leading-relaxed">
                {audit.reason.explanation}
              </p>
              {audit.reason.quote && (
                <div className="text-[11px] font-mono text-[#F4B942] bg-[#070B18] p-2 rounded border border-[#1E294B]">
                  "{audit.reason.quote}"
                </div>
              )}
              {audit.reason.suggested_question && (
                <div className="text-[11px] text-[#48D9E8] bg-[#111936] p-2 rounded border border-[#1E294B]">
                  <strong className="block text-[10px] uppercase text-[#8E98B7] mb-0.5">Suggested Question to ask:</strong>
                  "{audit.reason.suggested_question}"
                </div>
              )}
            </div>

            {/* 3. Evidence */}
            <div
              onClick={() => setSelectedHighlightQuote(audit.evidence.quote)}
              className="p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] hover:border-[#FF6B6B]/40 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF6B6B]" />
                  <span className="text-xs font-semibold text-[#F7F4ED]">3. Evidence</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20">
                  {audit.evidence.status}
                </span>
              </div>
              <p className="text-xs text-[#8E98B7] leading-relaxed">
                {audit.evidence.explanation}
              </p>
              {audit.evidence.quote ? (
                <div className="text-[11px] font-mono text-stone-300 bg-[#070B18] p-2 rounded border border-[#1E294B]">
                  "{audit.evidence.quote}"
                </div>
              ) : (
                <div className="text-[11px] text-[#FF6B6B] italic font-mono bg-[#FF6B6B]/5 p-2 rounded">
                  [No specific transcripts or records cited in notice]
                </div>
              )}
            </div>

            {/* 4. Rule */}
            <div
              onClick={() => setSelectedHighlightQuote(audit.rule.quote)}
              className="p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] hover:border-[#6857FF]/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#6857FF]" />
                  <span className="text-xs font-semibold text-[#F7F4ED]">4. Governing Rule</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#6857FF]/10 text-[#6857FF] border border-[#6857FF]/20">
                  {audit.rule.status}
                </span>
              </div>
              <p className="text-xs text-[#8E98B7] leading-relaxed">
                {audit.rule.explanation}
              </p>
              {audit.rule.quote && (
                <div className="text-[11px] font-mono text-stone-300 bg-[#070B18] p-2 rounded border border-[#1E294B]">
                  "{audit.rule.quote}"
                </div>
              )}
            </div>

            {/* 5. Deadline */}
            <div
              onClick={() => setSelectedHighlightQuote(audit.deadline.quote)}
              className="p-4 rounded-xl bg-[#0F162E] border border-[#FF6B6B]/30 bg-[#FF6B6B]/5 hover:border-[#FF6B6B] transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF6B6B]" />
                  <span className="text-xs font-semibold text-[#F7F4ED]">5. Deadline</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30">
                  {audit.deadline.status}
                </span>
              </div>
              <p className="text-xs text-[#8E98B7] leading-relaxed">
                {audit.deadline.explanation}
              </p>
              {audit.deadline.quote && (
                <div className="text-[11px] font-mono text-[#FF8585] bg-[#070B18] p-2 rounded border border-[#1E294B]">
                  "{audit.deadline.quote}"
                </div>
              )}
            </div>

            {/* 6. Review Path */}
            <div
              onClick={() => setSelectedHighlightQuote(audit.review_path.quote)}
              className="p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] hover:border-[#48D9E8]/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#48D9E8]" />
                  <span className="text-xs font-semibold text-[#F7F4ED]">6. Review or Appeal Path</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#48D9E8]/10 text-[#48D9E8] border border-[#48D9E8]/20">
                  {audit.review_path.status}
                </span>
              </div>
              <p className="text-xs text-[#8E98B7] leading-relaxed">
                {audit.review_path.explanation}
              </p>
              {audit.review_path.quote && (
                <div className="text-[11px] font-mono text-stone-300 bg-[#070B18] p-2 rounded border border-[#1E294B]">
                  "{audit.review_path.quote}"
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={handleOpenInWorkspace}
              className="flex-1 py-3 px-4 rounded-xl bg-[#6857FF] hover:bg-[#7869FF] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Open in Full Transparency Workspace</span>
            </button>
            <button
              onClick={handleOpenActionPlan}
              className="py-3 px-4 rounded-xl bg-[#111936] hover:bg-[#18234D] text-[#F7F4ED] border border-[#1E294B] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4 text-[#2ECC9A]" />
              <span>Review Action Checklist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
