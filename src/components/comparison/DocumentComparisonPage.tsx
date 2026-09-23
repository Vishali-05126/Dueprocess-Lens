import React, { useState } from 'react';
import { AlignmentRow, ContradictionRadarItem } from '../../types';
import { SAMPLE_NOTICES } from '../../data/sampleNotices';
import { 
  GitCompare, AlertTriangle, CheckCircle2, HelpCircle, Layers, 
  Sparkles, RefreshCw, FileText, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { SafetyBanner } from '../common/SafetyBanner';

interface DocumentComparisonPageProps {
  initialNoticeText?: string;
}

export const DocumentComparisonPage: React.FC<DocumentComparisonPageProps> = ({ initialNoticeText }) => {
  const defaultSample = SAMPLE_NOTICES[0];

  const [noticeText, setNoticeText] = useState(initialNoticeText || defaultSample.rawText);
  const [evidenceText, setEvidenceText] = useState(defaultSample.mockEvidence || '');
  const [policyText, setPolicyText] = useState(defaultSample.mockPolicy || '');
  const [isAligning, setIsAligning] = useState(false);

  const [alignmentMatrix, setAlignmentMatrix] = useState<AlignmentRow[]>([
    {
      element: 'Eligibility Threshold (GPA)',
      decisionNotice: 'Blanket denial: "did not meet eligibility requirements"',
      supportingEvidence: 'Official transcript: Cumulative GPA 3.82 / 4.0',
      policyRequirement: 'Policy Sec 3.1: Minimum GPA 3.50 required',
      status: 'Conflict',
      notes: 'Potential mismatch: Submitted GPA exceeds minimum threshold, suggesting possible evaluation error or unstated secondary filter.'
    },
    {
      element: 'Community Service Hours',
      decisionNotice: 'Not mentioned in rejection letter',
      supportingEvidence: 'Documented 120 service hours with Youth Center',
      policyRequirement: 'Policy Sec 3.1: Minimum 50 documented community hours',
      status: 'Match',
      notes: 'Submitted hours exceed minimum benchmark; verify whether civic hours log was credited.'
    },
    {
      element: 'Course Load / Enrollment',
      decisionNotice: 'Omitted from decision text',
      supportingEvidence: 'Enrolled full-time (15 credits Fall 2025)',
      policyRequirement: 'Policy Sec 3.1: Full-time status (minimum 12 credits)',
      status: 'Match',
      notes: 'Requirement satisfied according to submitted evidence.'
    },
    {
      element: 'Review Window Calculation',
      decisionNotice: '"within 14 days of this notice" (undated trigger)',
      supportingEvidence: 'Email delivery timestamp: Oct 15, 2025 at 09:12 AM',
      policyRequirement: 'Policy Sec 6: 14 calendar days from email delivery',
      status: 'Needs clarification',
      notes: 'Potential date ambiguity: Establish whether deadline is calculated from Oct 14 letterhead or Oct 15 email delivery.'
    },
    {
      element: 'Submission Destination',
      decisionNotice: '"Office of Academic Awards" (no email or portal listed)',
      supportingEvidence: 'Previous portal login submission receipt',
      policyRequirement: 'Policy Sec 6: Form SCH-Rev-1 via awards-review@northbridge.edu',
      status: 'Gap',
      notes: 'Notice failed to provide the designated review email and form number specified in the handbook.'
    }
  ]);

  const [contradictionRadar, setContradictionRadar] = useState<ContradictionRadarItem[]>([
    {
      id: 'rad-1',
      type: 'unreferenced_evidence',
      severity: 'urgent',
      title: 'Potential evaluation gap: GPA meets published criteria',
      description: 'The applicant\'s transcript demonstrates a 3.82 GPA, surpassing the 3.50 requirement in Section 3.1, yet the notice cites unmet eligibility.',
      recommendation: 'Request itemized scoring breakdown to verify if transcripts were received and correctly evaluated.'
    },
    {
      id: 'rad-2',
      type: 'conflicting_date',
      severity: 'attention',
      title: 'Timeline trigger discrepancy',
      description: 'Letter cites "within 14 days of this notice", whereas policy specifies "14 calendar days of email delivery".',
      recommendation: 'Treat the earliest date (October 28) as the operating target to prevent procedural dismissal.'
    },
    {
      id: 'rad-3',
      type: 'unspecified_requirement',
      severity: 'neutral',
      title: 'Missing submission instructions in notice',
      description: 'Notice omits the official review Form SCH-Rev-1 and review inbox mandated by governing policy.',
      recommendation: 'Download Form SCH-Rev-1 directly from the university portal for submission.'
    }
  ]);

  const handleLoadSample = (sampleId: string) => {
    const s = SAMPLE_NOTICES.find(item => item.id === sampleId);
    if (!s) return;
    setNoticeText(s.rawText);
    setEvidenceText(s.mockEvidence || '');
    setPolicyText(s.mockPolicy || '');
  };

  const handleRunAlignment = async () => {
    setIsAligning(true);
    try {
      const res = await fetch('/api/align-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noticeText, evidenceText, policyText })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.alignmentMatrix) setAlignmentMatrix(data.alignmentMatrix);
        if (data.contradictionRadar) setContradictionRadar(data.contradictionRadar);
      }
    } catch (err) {
      console.error('Failed to align evidence via server:', err);
    } finally {
      setIsAligning(false);
    }
  };

  const getStatusBadge = (status: AlignmentRow['status']) => {
    switch (status) {
      case 'Match':
        return <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#2ECC9A]/10 text-[#2ECC9A] border border-[#2ECC9A]/30">Match</span>;
      case 'Conflict':
        return <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF6B6B]/15 text-[#FF8585] border border-[#FF6B6B]/30 font-semibold">Potential Mismatch</span>;
      case 'Gap':
        return <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F4B942]/10 text-[#F4B942] border border-[#F4B942]/30">Documentation Gap</span>;
      case 'Needs clarification':
      default:
        return <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#48D9E8]/10 text-[#48D9E8] border border-[#48D9E8]/30">Needs Clarification</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SafetyBanner />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E294B] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#111936] text-[11px] text-[#48D9E8] font-medium border border-[#1E294B] mb-2">
            <span>Three-Way Document Cross-Check</span>
          </div>
          <h1 className="text-3xl font-serif text-[#F7F4ED]">
            Evidence Alignment & Contradiction Radar
          </h1>
          <p className="text-xs sm:text-sm text-[#8E98B7] mt-1 max-w-2xl leading-relaxed">
            Compare the decision letter against your submitted evidence and the official governing policy. Discover discrepancies, unreferenced records, and omitted regulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8E98B7]">Load test scenario:</span>
          <select
            onChange={(e) => handleLoadSample(e.target.value)}
            className="text-xs bg-[#0F162E] border border-[#1E294B] rounded-lg px-3 py-1.5 text-[#F7F4ED]"
          >
            <option value="sample-scholarship">Northbridge Scholarship</option>
            <option value="sample-admission">Graduate Admissions</option>
            <option value="sample-benefits">Benefits Adjudication</option>
          </select>
        </div>
      </div>

      {/* 3-Way Input Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Decision Notice */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#F7F4ED] flex items-center justify-between">
            <span>1. Decision Notice Text</span>
            <span className="text-[10px] text-[#48D9E8] font-mono">Rejection Letter</span>
          </label>
          <textarea
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            rows={7}
            className="w-full text-xs font-mono bg-[#070B18] border border-[#1E294B] rounded-xl p-3 text-[#F7F4ED] focus:border-[#6857FF] focus:outline-none leading-relaxed"
            placeholder="Decision notice text..."
          />
        </div>

        {/* Column 2: Supporting Evidence */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#F7F4ED] flex items-center justify-between">
            <span>2. Your Submitted Evidence</span>
            <span className="text-[10px] text-[#2ECC9A] font-mono">Transcripts / Proof</span>
          </label>
          <textarea
            value={evidenceText}
            onChange={(e) => setEvidenceText(e.target.value)}
            rows={7}
            className="w-full text-xs font-mono bg-[#070B18] border border-[#1E294B] rounded-xl p-3 text-[#F7F4ED] focus:border-[#6857FF] focus:outline-none leading-relaxed"
            placeholder="Paste your GPA, credit hours, utility proofs, submission dates..."
          />
        </div>

        {/* Column 3: Governing Policy */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#F7F4ED] flex items-center justify-between">
            <span>3. Governing Policy / Rules</span>
            <span className="text-[10px] text-[#6857FF] font-mono">Handbook / Directive</span>
          </label>
          <textarea
            value={policyText}
            onChange={(e) => setPolicyText(e.target.value)}
            rows={7}
            className="w-full text-xs font-mono bg-[#070B18] border border-[#1E294B] rounded-xl p-3 text-[#F7F4ED] focus:border-[#6857FF] focus:outline-none leading-relaxed"
            placeholder="Paste handbook sections, minimum GPA criteria, appeal rules..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRunAlignment}
          disabled={isAligning}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#6857FF] to-[#5143E0] hover:from-[#7869FF] hover:to-[#6052F0] rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAligning ? 'animate-spin' : ''}`} />
          <span>{isAligning ? 'Comparing Documents...' : 'Refresh Alignment Analysis'}</span>
        </button>
      </div>

      {/* CONTRADICTION RADAR SECTION */}
      <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />
            <h3 className="text-sm font-semibold text-[#F7F4ED]">Contradiction Radar</h3>
          </div>
          <span className="text-[11px] font-mono text-[#8E98B7]">
            {contradictionRadar.length} Potential Mismatches Detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contradictionRadar.map(item => (
            <div 
              key={item.id}
              className="p-4 rounded-xl bg-[#070B18] border border-[#1E294B] hover:border-[#FF6B6B]/40 space-y-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF6B6B]/10 text-[#FF8585] border border-[#FF6B6B]/20">
                  {item.severity}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-[#F7F4ED] leading-snug">{item.title}</h4>
              <p className="text-[11px] text-[#8E98B7] leading-relaxed">{item.description}</p>
              <div className="pt-2 border-t border-[#1E294B] text-[11px] text-[#48D9E8]">
                <strong>Suggested Next Step:</strong> {item.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EVIDENCE ALIGNMENT MATRIX TABLE */}
      <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#48D9E8]" />
            <h3 className="text-sm font-semibold text-[#F7F4ED]">Evidence Alignment Matrix</h3>
          </div>
          <span className="text-[11px] text-[#8E98B7]">Side-by-Side Fact Verification</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E294B] text-[#8E98B7] text-[11px] uppercase tracking-wider font-mono">
                <th className="py-3 px-3">Element</th>
                <th className="py-3 px-3">Decision Notice</th>
                <th className="py-3 px-3">Supporting Evidence</th>
                <th className="py-3 px-3">Governing Policy</th>
                <th className="py-3 px-3">Audit Status</th>
                <th className="py-3 px-3">Analysis Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E294B]/60 text-stone-300 font-sans">
              {alignmentMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#111936]/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#F7F4ED] whitespace-nowrap">
                    {row.element}
                  </td>
                  <td className="py-3.5 px-3 text-[#8E98B7] font-mono text-[11px] max-w-[180px]">
                    {row.decisionNotice}
                  </td>
                  <td className="py-3.5 px-3 text-[#F7F4ED] max-w-[200px]">
                    {row.supportingEvidence}
                  </td>
                  <td className="py-3.5 px-3 text-[#48D9E8] max-w-[200px]">
                    {row.policyRequirement}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="py-3.5 px-3 text-[#8E98B7] text-[11px] leading-relaxed max-w-[240px]">
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
