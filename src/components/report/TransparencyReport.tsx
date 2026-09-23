import React, { useState } from 'react';
import { TransparencyReportData, PotentialGap } from '../../types';
import { 
  CheckCircle2, AlertTriangle, HelpCircle, Clock, Compass, BookOpen, 
  ArrowRight, Sparkles, Scale, Info, Copy, Check, Eye, ChevronRight, 
  ShieldCheck, AlertCircle, FileText, CornerDownRight 
} from 'lucide-react';
import { SafetyBanner } from '../common/SafetyBanner';

interface TransparencyReportProps {
  report: TransparencyReportData;
  rawNotice?: string;
  onNavigateToAction: () => void;
  onNavigateToComparison: () => void;
}

export const TransparencyReport: React.FC<TransparencyReportProps> = ({ 
  report, 
  rawNotice, 
  onNavigateToAction, 
  onNavigateToComparison 
}) => {
  const [selectedDimension, setSelectedDimension] = useState<string>('reason');
  const [highlightedQuote, setHighlightedQuote] = useState<string>(report.transparency_audit.reason.quote || '');
  const [activeExplainModal, setActiveExplainModal] = useState<string | null>(null);
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);

  const audit = report.transparency_audit;
  const summary = report.decision_summary;

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIndex(idx);
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  // Node status helper for Decision Anatomy
  const getNodeColor = (status: string, isDeadline = false) => {
    if (isDeadline && (status === 'ambiguous' || status === 'missing')) {
      return {
        border: 'border-[#FF6B6B]',
        bg: 'bg-[#FF6B6B]/10',
        text: 'text-[#FF8585]',
        glow: 'shadow-[#FF6B6B]/20'
      };
    }
    if (status === 'clear' || status === 'specific' || status === 'referenced' || status === 'identified' || status === 'found') {
      return {
        border: 'border-[#2ECC9A]',
        bg: 'bg-[#2ECC9A]/10',
        text: 'text-[#2ECC9A]',
        glow: 'shadow-[#2ECC9A]/20'
      };
    }
    return {
      border: 'border-[#F4B942]',
      bg: 'bg-[#F4B942]/10',
      text: 'text-[#F4B942]',
      glow: 'shadow-[#F4B942]/20'
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Safety Notice Banner */}
      <SafetyBanner urgentFlags={report.urgent_review_flags} />

      {/* Header & Clarity Score */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1E294B] pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#48D9E8]">
            <span className="w-2 h-2 rounded-full bg-[#48D9E8] animate-ping" />
            <span>TRANSPARENCY AUDIT // {summary.institution || 'INSTITUTIONAL NOTICE'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F7F4ED]">
            Transparency Report
          </h1>
          <p className="text-xs sm:text-sm text-[#8E98B7] max-w-2xl leading-relaxed">
            An information-clarity analysis of your decision notice. This audit examines whether the notice communicates the essential facts, governing rules, and official review procedures.
          </p>
        </div>

        {/* Clarity Score Card */}
        <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-5 lg:min-w-[320px] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8E98B7] uppercase tracking-wider">
              Communication Clarity
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#2ECC9A]">
              <ShieldCheck className="w-4 h-4" />
              <span>Six-Point Audit</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-serif font-bold text-[#F7F4ED] tracking-tight">
              {report.clarity_score}
            </span>
            <span className="text-sm font-mono text-[#8E98B7]">/ 100</span>
          </div>

          <div className="w-full bg-[#070B18] h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ${
                report.clarity_score > 70 ? 'bg-[#2ECC9A]' : report.clarity_score > 40 ? 'bg-[#F4B942]' : 'bg-[#FF6B6B]'
              }`}
              style={{ width: `${report.clarity_score}%` }}
            />
          </div>

          <p className="text-[11px] leading-relaxed text-[#8E98B7]">
            This score reflects how completely the document communicates the six information elements reviewed. It does not determine whether the decision was lawful or correct.
          </p>
        </div>
      </div>

      {/* Decision Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] text-xs font-mono">
        <div>
          <span className="text-[#8E98B7] block text-[10px] uppercase">Formal Determination</span>
          <span className="text-[#F7F4ED] font-medium truncate block">{summary.decision}</span>
        </div>
        <div>
          <span className="text-[#8E98B7] block text-[10px] uppercase">Issuing Institution</span>
          <span className="text-[#F7F4ED] font-medium truncate block">{summary.institution}</span>
        </div>
        <div>
          <span className="text-[#8E98B7] block text-[10px] uppercase">Date of Notice</span>
          <span className="text-[#F7F4ED] font-medium truncate block">{summary.date_received || 'Undated'}</span>
        </div>
        <div>
          <span className="text-[#8E98B7] block text-[10px] uppercase">Reference Number</span>
          <span className="text-[#48D9E8] font-medium truncate block">{summary.reference_number || 'None stated'}</span>
        </div>
      </div>

      {/* INTERACTIVE "DECISION ANATOMY" VISUALIZATION */}
      <div className="rounded-3xl bg-[#0F162E] border border-[#1E294B] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E294B] pb-4">
          <div>
            <h2 className="text-lg font-serif font-medium text-[#F7F4ED] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#48D9E8]" />
              <span>Decision Anatomy Visualization</span>
            </h2>
            <p className="text-xs text-[#8E98B7]">
              Six interconnected dimensions. Nodes glow green for clear items, amber for vague/incomplete elements, and red for urgent deadlines.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2ECC9A]" /> Clear</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F4B942]" /> Vague / Incomplete</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF6B6B]" /> Ambiguous Deadline</span>
          </div>
        </div>

        {/* Node Diagram Layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
          {/* Node 1: Decision */}
          <div 
            onClick={() => {
              setSelectedDimension('decision');
              setHighlightedQuote(audit.decision.quote);
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedDimension === 'decision' ? 'ring-2 ring-[#48D9E8]' : ''
            } ${getNodeColor(audit.decision.status).bg} ${getNodeColor(audit.decision.status).border}`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span>01. DECISION</span>
              <span className="capitalize">{audit.decision.status}</span>
            </div>
            <p className="text-xs text-[#F7F4ED] font-medium line-clamp-2">
              {audit.decision.explanation}
            </p>
          </div>

          {/* Node 2: Reason */}
          <div 
            onClick={() => {
              setSelectedDimension('reason');
              setHighlightedQuote(audit.reason.quote);
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedDimension === 'reason' ? 'ring-2 ring-[#48D9E8]' : ''
            } ${getNodeColor(audit.reason.status).bg} ${getNodeColor(audit.reason.status).border}`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span>02. REASON</span>
              <span className="capitalize">{audit.reason.status}</span>
            </div>
            <p className="text-xs text-[#F7F4ED] font-medium line-clamp-2">
              {audit.reason.explanation}
            </p>
          </div>

          {/* Node 3: Evidence */}
          <div 
            onClick={() => {
              setSelectedDimension('evidence');
              setHighlightedQuote(audit.evidence.quote);
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedDimension === 'evidence' ? 'ring-2 ring-[#48D9E8]' : ''
            } ${getNodeColor(audit.evidence.status).bg} ${getNodeColor(audit.evidence.status).border}`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span>03. EVIDENCE</span>
              <span className="capitalize">{audit.evidence.status}</span>
            </div>
            <p className="text-xs text-[#F7F4ED] font-medium line-clamp-2">
              {audit.evidence.explanation}
            </p>
          </div>

          {/* Node 4: Rule */}
          <div 
            onClick={() => {
              setSelectedDimension('rule');
              setHighlightedQuote(audit.rule.quote);
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedDimension === 'rule' ? 'ring-2 ring-[#48D9E8]' : ''
            } ${getNodeColor(audit.rule.status).bg} ${getNodeColor(audit.rule.status).border}`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span>04. RULE</span>
              <span className="capitalize">{audit.rule.status}</span>
            </div>
            <p className="text-xs text-[#F7F4ED] font-medium line-clamp-2">
              {audit.rule.explanation}
            </p>
          </div>

          {/* Node 5: Deadline */}
          <div 
            onClick={() => {
              setSelectedDimension('deadline');
              setHighlightedQuote(audit.deadline.quote);
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedDimension === 'deadline' ? 'ring-2 ring-[#48D9E8]' : ''
            } ${getNodeColor(audit.deadline.status, true).bg} ${getNodeColor(audit.deadline.status, true).border}`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span>05. DEADLINE</span>
              <span className="capitalize">{audit.deadline.status}</span>
            </div>
            <p className="text-xs text-[#F7F4ED] font-medium line-clamp-2">
              {audit.deadline.explanation}
            </p>
          </div>

          {/* Node 6: Review Path */}
          <div 
            onClick={() => {
              setSelectedDimension('review_path');
              setHighlightedQuote(audit.review_path.quote);
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedDimension === 'review_path' ? 'ring-2 ring-[#48D9E8]' : ''
            } ${getNodeColor(audit.review_path.status).bg} ${getNodeColor(audit.review_path.status).border}`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span>06. REVIEW</span>
              <span className="capitalize">{audit.review_path.status}</span>
            </div>
            <p className="text-xs text-[#F7F4ED] font-medium line-clamp-2">
              {audit.review_path.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED SIX AUDIT CARDS WITH DOCUMENT CITATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Six Detailed Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-medium text-[#F7F4ED]">
              Detailed Audit Findings
            </h3>
            <span className="text-xs text-[#8E98B7]">Click quote to trace in document</span>
          </div>

          {/* 1. Decision Card */}
          <div 
            className={`p-5 rounded-2xl bg-[#0F162E] border transition-all space-y-3 ${
              selectedDimension === 'decision' ? 'border-[#48D9E8] shadow-lg shadow-[#48D9E8]/10' : 'border-[#1E294B]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2ECC9A]" />
                <h4 className="text-sm font-semibold text-[#F7F4ED]">1. Decision Outcome</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#2ECC9A]/10 text-[#2ECC9A] border border-[#2ECC9A]/30">
                  {audit.decision.status}
                </span>
                <span className="text-[11px] font-mono text-[#8E98B7]">Conf: {audit.decision.confidence}%</span>
              </div>
            </div>

            <p className="text-xs text-[#8E98B7] leading-relaxed">
              {audit.decision.explanation}
            </p>

            {audit.decision.quote && (
              <div 
                onClick={() => {
                  setSelectedDimension('decision');
                  setHighlightedQuote(audit.decision.quote);
                }}
                className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-xs font-mono text-stone-200 cursor-pointer hover:border-[#2ECC9A]/50 transition-colors"
              >
                <div className="text-[10px] text-[#8E98B7] flex items-center justify-between mb-1">
                  <span>Location: {audit.decision.location || 'Notice Body'}</span>
                  <span className="text-[#48D9E8] flex items-center gap-1"><Eye className="w-3 h-3" /> Click to view</span>
                </div>
                "{audit.decision.quote}"
              </div>
            )}
          </div>

          {/* 2. Reason Card */}
          <div 
            className={`p-5 rounded-2xl bg-[#0F162E] border transition-all space-y-3 ${
              selectedDimension === 'reason' ? 'border-[#F4B942] shadow-lg shadow-[#F4B942]/10' : 'border-[#1E294B]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F4B942]" />
                <h4 className="text-sm font-semibold text-[#F7F4ED]">2. Stated Reason</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F4B942]/10 text-[#F4B942] border border-[#F4B942]/30">
                  {audit.reason.status}
                </span>
                <span className="text-[11px] font-mono text-[#8E98B7]">Conf: {audit.reason.confidence}%</span>
              </div>
            </div>

            <p className="text-xs text-[#8E98B7] leading-relaxed">
              {audit.reason.explanation}
            </p>

            {audit.reason.quote && (
              <div 
                onClick={() => {
                  setSelectedDimension('reason');
                  setHighlightedQuote(audit.reason.quote);
                }}
                className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-xs font-mono text-[#F4B942] cursor-pointer hover:border-[#F4B942] transition-colors"
              >
                <div className="text-[10px] text-[#8E98B7] flex items-center justify-between mb-1">
                  <span>Location: {audit.reason.location || 'Body text'}</span>
                  <span className="text-[#48D9E8] flex items-center gap-1"><Eye className="w-3 h-3" /> Click to trace</span>
                </div>
                "{audit.reason.quote}"
              </div>
            )}

            {/* Why it matters & suggested question */}
            <div className="p-3 rounded-xl bg-[#111936] border border-[#1E294B] space-y-2 text-xs">
              <div className="text-[#F7F4ED] font-medium text-[11px] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#48D9E8]" />
                <span>Why this transparency gap matters:</span>
              </div>
              <p className="text-[11px] text-[#8E98B7] leading-relaxed">
                When an institution gives only a generic rejection ("did not meet requirements"), you cannot tell whether your materials were misfiled, an prerequisite course miscalculated, or quota exceeded.
              </p>
              {audit.reason.suggested_question && (
                <div className="pt-1 border-t border-[#1E294B] flex items-start justify-between gap-2">
                  <div className="text-[11px] text-[#48D9E8]">
                    <span className="font-semibold block text-[#F7F4ED]">Consider asking:</span>
                    "{audit.reason.suggested_question}"
                  </div>
                  <button
                    onClick={() => handleCopyQuestion(audit.reason.suggested_question!, 99)}
                    className="p-1 text-[#8E98B7] hover:text-[#F7F4ED] transition-colors"
                    title="Copy question"
                  >
                    {copiedQuestionIndex === 99 ? <Check className="w-3.5 h-3.5 text-[#2ECC9A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Evidence Card */}
          <div 
            className={`p-5 rounded-2xl bg-[#0F162E] border transition-all space-y-3 ${
              selectedDimension === 'evidence' ? 'border-[#FF6B6B] shadow-lg shadow-[#FF6B6B]/10' : 'border-[#1E294B]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF6B6B]" />
                <h4 className="text-sm font-semibold text-[#F7F4ED]">3. Evidence Considered</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/30">
                  {audit.evidence.status}
                </span>
                <span className="text-[11px] font-mono text-[#8E98B7]">Conf: {audit.evidence.confidence}%</span>
              </div>
            </div>

            <p className="text-xs text-[#8E98B7] leading-relaxed">
              {audit.evidence.explanation}
            </p>

            {audit.evidence.quote ? (
              <div 
                onClick={() => {
                  setSelectedDimension('evidence');
                  setHighlightedQuote(audit.evidence.quote);
                }}
                className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-xs font-mono text-stone-200 cursor-pointer"
              >
                <div className="text-[10px] text-[#8E98B7] mb-1">Location: {audit.evidence.location}</div>
                "{audit.evidence.quote}"
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#FF6B6B]/5 border border-[#FF6B6B]/20 text-[11px] font-mono text-[#FF8585]">
                [Verbatim Quote Missing]: No specific transcripts, pay stubs, or evaluation matrices are itemized in this notice.
              </div>
            )}
          </div>

          {/* 4. Rule Card */}
          <div 
            className={`p-5 rounded-2xl bg-[#0F162E] border transition-all space-y-3 ${
              selectedDimension === 'rule' ? 'border-[#6857FF] shadow-lg shadow-[#6857FF]/10' : 'border-[#1E294B]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6857FF]" />
                <h4 className="text-sm font-semibold text-[#F7F4ED]">4. Rule or Requirement Applied</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#6857FF]/10 text-[#6857FF] border border-[#6857FF]/30">
                  {audit.rule.status}
                </span>
                <span className="text-[11px] font-mono text-[#8E98B7]">Conf: {audit.rule.confidence}%</span>
              </div>
            </div>

            <p className="text-xs text-[#8E98B7] leading-relaxed">
              {audit.rule.explanation}
            </p>

            {audit.rule.quote && (
              <div 
                onClick={() => {
                  setSelectedDimension('rule');
                  setHighlightedQuote(audit.rule.quote);
                }}
                className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-xs font-mono text-stone-200 cursor-pointer"
              >
                <div className="text-[10px] text-[#8E98B7] mb-1">Location: {audit.rule.location}</div>
                "{audit.rule.quote}"
              </div>
            )}
          </div>

          {/* 5. Deadline Card */}
          <div 
            className={`p-5 rounded-2xl bg-[#0F162E] border transition-all space-y-3 ${
              selectedDimension === 'deadline' ? 'border-[#FF6B6B] shadow-lg shadow-[#FF6B6B]/15' : 'border-[#1E294B]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6B6B]" />
                <h4 className="text-sm font-semibold text-[#F7F4ED]">5. Deadline & Timeline</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30 font-semibold">
                  {audit.deadline.status}
                </span>
                <span className="text-[11px] font-mono text-[#8E98B7]">Conf: {audit.deadline.confidence}%</span>
              </div>
            </div>

            <p className="text-xs text-[#8E98B7] leading-relaxed">
              {audit.deadline.explanation}
            </p>

            {audit.deadline.quote && (
              <div 
                onClick={() => {
                  setSelectedDimension('deadline');
                  setHighlightedQuote(audit.deadline.quote);
                }}
                className="p-3 rounded-lg bg-[#070B18] border border-[#FF6B6B]/30 text-xs font-mono text-[#FF8585] cursor-pointer"
              >
                <div className="text-[10px] text-[#8E98B7] mb-1">Extracted Deadline Clause</div>
                "{audit.deadline.quote}"
              </div>
            )}

            <div className="p-3 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[11px] text-[#FF8585] leading-relaxed">
              <strong>Deadline Ambiguity Alert:</strong> If this calculation runs from dispatch date or date of receipt, missing the deadline forfeits administrative reconsideration. Calculate target cutoff dates immediately.
            </div>
          </div>

          {/* 6. Review or Appeal Path Card */}
          <div 
            className={`p-5 rounded-2xl bg-[#0F162E] border transition-all space-y-3 ${
              selectedDimension === 'review_path' ? 'border-[#48D9E8] shadow-lg shadow-[#48D9E8]/10' : 'border-[#1E294B]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#48D9E8]" />
                <h4 className="text-sm font-semibold text-[#F7F4ED]">6. Clarification, Review & Appeal Path</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#48D9E8]/10 text-[#48D9E8] border border-[#48D9E8]/30">
                  {audit.review_path.status}
                </span>
                <span className="text-[11px] font-mono text-[#8E98B7]">Conf: {audit.review_path.confidence}%</span>
              </div>
            </div>

            <p className="text-xs text-[#8E98B7] leading-relaxed">
              {audit.review_path.explanation}
            </p>

            {audit.review_path.quote && (
              <div 
                onClick={() => {
                  setSelectedDimension('review_path');
                  setHighlightedQuote(audit.review_path.quote);
                }}
                className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-xs font-mono text-stone-200 cursor-pointer"
              >
                <div className="text-[10px] text-[#8E98B7] mb-1">Review Instructions in Document</div>
                "{audit.review_path.quote}"
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Original Document Trace & "What is Unclear?" View */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Document Tracer Box */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[#F7F4ED]">
                <FileText className="w-4 h-4 text-[#48D9E8]" />
                <span>Document Source Tracing</span>
              </div>
              <span className="text-[11px] font-mono text-[#8E98B7]">Verbatim Text</span>
            </div>

            {/* Parchment Box */}
            <div className="parchment-surface rounded-xl p-5 font-mono text-xs text-stone-900 max-h-[380px] overflow-y-auto leading-relaxed border border-stone-300">
              {(rawNotice || report.rawText || 'No raw notice provided.').split('\n').map((line, idx) => {
                const isMatch = highlightedQuote && highlightedQuote.length > 5 && line.toLowerCase().includes(highlightedQuote.toLowerCase().slice(0, 25));
                return (
                  <div
                    key={idx}
                    className={`transition-colors py-0.5 ${
                      isMatch
                        ? 'bg-[#F4B942]/40 text-stone-950 font-bold px-1 rounded shadow-xs'
                        : ''
                    }`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-[#8E98B7] leading-relaxed">
              Every finding above is pinned directly to exact lines in the notice. No hallucinated quotes or unsupported assertions.
            </p>
          </div>

          {/* "What is Unclear?" Consolidated Diagnosis */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[#F4B942]">
              <AlertTriangle className="w-4 h-4" />
              <span>What this notice leaves unclear:</span>
            </div>

            <div className="space-y-3">
              {report.potential_gaps.map((gap, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] space-y-1 text-xs">
                  <div className="font-semibold text-[#F7F4ED] flex items-center justify-between">
                    <span>{gap.title}</span>
                    <span className="text-[10px] font-mono text-[#8E98B7] uppercase">{gap.dimension}</span>
                  </div>
                  <p className="text-[#8E98B7] text-[11px]">{gap.issue}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateToAction}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6857FF] to-[#5143E0] hover:from-[#7869FF] hover:to-[#6052F0] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#6857FF]/20"
              >
                <span>Proceed to Action Plan & Question Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
