import React, { useState } from 'react';
import { TransparencyReportData, ActionChecklistItem } from '../../types';
import { 
  CheckSquare, Square, Plus, Trash2, Edit3, Copy, Check, Download, 
  HelpCircle, Compass, Users, Sparkles, AlertTriangle, ShieldCheck, 
  Clock, ArrowRight, FileText, Send 
} from 'lucide-react';
import { SafetyBanner } from '../common/SafetyBanner';

interface ActionPlanPageProps {
  report: TransparencyReportData;
  onUpdateChecklist?: (items: ActionChecklistItem[]) => void;
  onNavigateToCase?: () => void;
}

export const ActionPlanPage: React.FC<ActionPlanPageProps> = ({ 
  report, 
  onUpdateChecklist,
  onNavigateToCase 
}) => {
  const [checklist, setChecklist] = useState<ActionChecklistItem[]>(report.action_checklist || []);
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>('all');
  
  // Custom checklist item form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetail, setNewTaskDetail] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<ActionChecklistItem['phase']>('B. Gather relevant information');

  // Question Builder state
  const [questions, setQuestions] = useState<string[]>(report.neutral_questions || []);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);

  // Draft Clarification Request state
  const [applicantName, setApplicantName] = useState('Applicant Name');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [clarificationLetter, setClarificationLetter] = useState<string>('');
  const [hasCopiedLetter, setHasCopiedLetter] = useState(false);

  const phases = [
    'A. Understand the decision',
    'B. Gather relevant information',
    'C. Clarify missing information',
    'D. Check official process',
    'E. Seek human support'
  ];

  const handleToggleItem = (id: string) => {
    const updated = checklist.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setChecklist(updated);
    if (onUpdateChecklist) onUpdateChecklist(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newItem: ActionChecklistItem = {
      id: `custom-${Date.now()}`,
      phase: newTaskPhase,
      task: newTaskTitle.trim(),
      category: 'gather',
      detail: newTaskDetail.trim() || 'Custom checklist action item.',
      completed: false,
      urgency: 'normal'
    };

    const updated = [...checklist, newItem];
    setChecklist(updated);
    if (onUpdateChecklist) onUpdateChecklist(updated);
    setNewTaskTitle('');
    setNewTaskDetail('');
    setShowAddForm(false);
  };

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIndex(idx);
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setQuestions([...questions, newQuestionText.trim()]);
    setNewQuestionText('');
  };

  // Generate or generate draft clarification letter
  const handleGenerateDraft = async () => {
    setIsGeneratingDraft(true);
    try {
      const res = await fetch('/api/draft-clarification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionSummary: report.decision_summary,
          gaps: report.potential_gaps,
          applicantName,
          questions
        })
      });

      if (res.ok) {
        const data = await res.json();
        setClarificationLetter(data.letter);
      } else {
        throw new Error('Fallback to local letter template');
      }
    } catch {
      // Local fallback letter template
      const institution = report.decision_summary.institution || 'Admissions / Evaluation Committee';
      const ref = report.decision_summary.reference_number || '[Reference Number]';
      const date = report.decision_summary.date_received || '[Date of Notice]';

      const template = `Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

To: The Reviewing Body / Committee
${institution}

Subject: Request for Factual Clarification — Reference: ${ref}

Dear Committee Members,

Thank you for your evaluation of my application and for providing the decision notice dated ${date}.

To ensure my records are complete and to understand the factual basis of the determination, I respectfully request clarification regarding the following points:

${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

Additionally, could you please confirm the designated official review process, accepted submission method, and the exact calendar deadline for requesting reconsideration?

Thank you for your time, assistance, and guidance on the appropriate next steps.

Sincerely,

${applicantName}
Candidate / Applicant
Reference ID: ${ref}`;

      setClarificationLetter(template);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(clarificationLetter);
    setHasCopiedLetter(true);
    setTimeout(() => setHasCopiedLetter(false), 2000);
  };

  const completedCount = checklist.filter(i => i.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  const filteredItems = activePhaseFilter === 'all' 
    ? checklist 
    : checklist.filter(item => item.phase === activePhaseFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Safety Notice */}
      <SafetyBanner urgentFlags={report.urgent_review_flags} />

      {/* Page Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E294B] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#111936] text-[11px] text-[#48D9E8] font-medium border border-[#1E294B] mb-2">
            <span>Action Checklist & Clarification Builder</span>
          </div>
          <h1 className="text-3xl font-serif text-[#F7F4ED]">
            Turn uncertainty into preparation.
          </h1>
          <p className="text-xs sm:text-sm text-[#8E98B7] mt-1 max-w-2xl leading-relaxed">
            This checklist helps you organize information and investigate the official process. It does not predict the outcome of an appeal.
          </p>
        </div>

        {/* Progress Summary */}
        <div className="flex items-center gap-4 bg-[#0F162E] border border-[#1E294B] rounded-xl p-3 px-5">
          <div className="space-y-1">
            <span className="text-[10px] text-[#8E98B7] uppercase font-mono block">Preparation Progress</span>
            <div className="text-sm font-semibold text-[#F7F4ED] font-mono">
              {completedCount} of {checklist.length} Tasks Complete ({progressPercent}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#1E294B] flex items-center justify-center font-mono text-xs font-bold text-[#2ECC9A]">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Main Grid: Action Checklist (Left 7 Cols) and Question Builder & Escalation (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: DYNAMIC ACTION CHECKLIST */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-serif font-medium text-[#F7F4ED] flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#2ECC9A]" />
              <span>Response Checklist</span>
            </h2>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              <button
                onClick={() => setActivePhaseFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activePhaseFilter === 'all' ? 'bg-[#111936] text-[#48D9E8] font-medium' : 'text-[#8E98B7] hover:text-[#F7F4ED]'
                }`}
              >
                All
              </button>
              {phases.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhaseFilter(p)}
                  className={`px-2 py-1 rounded-md transition-colors text-[11px] whitespace-nowrap ${
                    activePhaseFilter === p ? 'bg-[#111936] text-[#48D9E8] font-medium' : 'text-[#8E98B7] hover:text-[#F7F4ED]'
                  }`}
                >
                  Phase {p.slice(0, 1)}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist Items Grouped */}
          <div className="space-y-3">
            {filteredItems.map(item => (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  item.completed 
                    ? 'bg-[#111936]/40 border-[#1E294B]/60 opacity-70' 
                    : item.urgency === 'urgent'
                    ? 'bg-[#FF6B6B]/5 border-[#FF6B6B]/40 hover:border-[#FF6B6B]'
                    : 'bg-[#0F162E] border-[#1E294B] hover:border-[#2D3C6E]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    className="mt-0.5 text-[#2ECC9A] focus:outline-none"
                    aria-label={`Toggle ${item.task}`}
                  >
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#2ECC9A]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8E98B7] hover:text-[#48D9E8]" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold ${item.completed ? 'line-through text-[#8E98B7]' : 'text-[#F7F4ED]'}`}>
                        {item.task}
                      </span>
                      {item.urgency === 'urgent' && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#FF6B6B]/15 text-[#FF8585] border border-[#FF6B6B]/30 shrink-0">
                          Urgent Timeline
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8E98B7] leading-relaxed">
                      {item.detail}
                    </p>
                    <div className="text-[10px] font-mono text-[#8E98B7]/70 pt-1">
                      {item.phase}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add custom action button */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#1E294B] hover:border-[#6857FF]/60 text-xs text-[#8E98B7] hover:text-[#F7F4ED] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Action Item</span>
            </button>
          ) : (
            <form onSubmit={handleAddItem} className="p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-3">
              <h4 className="text-xs font-semibold text-[#F7F4ED]">Add Custom Preparation Task</h4>
              <input
                type="text"
                placeholder="Task title (e.g. Request transcript verification from Registrar)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full text-xs bg-[#070B18] border border-[#1E294B] rounded-lg px-3 py-2 text-[#F7F4ED] focus:border-[#6857FF] focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Details or notes (optional)"
                value={newTaskDetail}
                onChange={(e) => setNewTaskDetail(e.target.value)}
                className="w-full text-xs bg-[#070B18] border border-[#1E294B] rounded-lg px-3 py-2 text-[#F7F4ED] focus:border-[#6857FF] focus:outline-none"
              />
              <div className="flex items-center justify-between pt-1">
                <select
                  value={newTaskPhase}
                  onChange={(e) => setNewTaskPhase(e.target.value as any)}
                  className="text-xs bg-[#070B18] border border-[#1E294B] rounded-lg px-2.5 py-1.5 text-[#F7F4ED]"
                >
                  {phases.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-[#8E98B7] hover:text-[#F7F4ED]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#6857FF] hover:bg-[#7869FF] rounded-lg"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Official Sources to Verify */}
          {report.official_sources_to_verify && report.official_sources_to_verify.length > 0 && (
            <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-5 space-y-3">
              <h3 className="text-xs font-semibold text-[#F7F4ED] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#48D9E8]" />
                <span>Official Sources to Independently Verify</span>
              </h3>
              <div className="space-y-2">
                {report.official_sources_to_verify.map((src, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-xs space-y-1">
                    <div className="font-medium text-[#F7F4ED] flex items-center justify-between">
                      <span>{src.title}</span>
                      <span className="text-[10px] font-mono text-[#8E98B7]">{src.sourceType}</span>
                    </div>
                    <p className="text-[11px] text-[#8E98B7]">{src.whyVerify}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: QUESTION BUILDER, DRAFT CLARIFICATION & HUMAN ESCALATION COMPASS */}
        <div className="lg:col-span-5 space-y-6">
          {/* NEUTRAL QUESTION BUILDER */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#48D9E8]" />
                <h3 className="text-sm font-semibold text-[#F7F4ED]">Neutral Question Builder</h3>
              </div>
              <span className="text-[10px] font-mono text-[#2ECC9A]">Grounded in Gaps</span>
            </div>

            <p className="text-xs text-[#8E98B7] leading-relaxed">
              These neutral, fact-focused questions address unstated requirements without making legal assertions or threats:
            </p>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
              {questions.map((q, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] text-xs space-y-2 group">
                  <p className="text-[#F7F4ED] leading-relaxed">"{q}"</p>
                  <div className="flex items-center justify-between pt-1 border-t border-[#1E294B]/60 text-[10px] text-[#8E98B7]">
                    <span>Fact-focused inquiry</span>
                    <button
                      onClick={() => handleCopyQuestion(q, idx)}
                      className="text-[#48D9E8] hover:underline flex items-center gap-1"
                    >
                      {copiedQuestionIndex === idx ? <Check className="w-3 h-3 text-[#2ECC9A]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedQuestionIndex === idx ? 'Copied' : 'Copy Question'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add custom question input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add a custom question..."
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                className="flex-1 text-xs bg-[#070B18] border border-[#1E294B] rounded-lg px-3 py-2 text-[#F7F4ED] focus:border-[#6857FF] focus:outline-none"
              />
              <button
                onClick={handleAddQuestion}
                className="px-3 py-2 text-xs font-semibold text-white bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* DRAFT FACTUAL CLARIFICATION REQUEST */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6857FF]" />
                <h3 className="text-sm font-semibold text-[#F7F4ED]">Factual Clarification Request</h3>
              </div>
              <span className="text-[10px] font-mono text-[#F4B942]">Draft Letter</span>
            </div>

            <div className="p-3 rounded-lg bg-[#F4B942]/10 border border-[#F4B942]/30 text-[11px] text-[#F4B942] space-y-1">
              <strong>Drafting Warning:</strong> Review this draft carefully. Do not submit it without checking names, dates, and facts. Avoid legal threats or accusations of wrongdoing.
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-[#8E98B7]">Your Name / Sign-off:</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Your full name"
                className="w-full text-xs bg-[#070B18] border border-[#1E294B] rounded-lg px-3 py-2 text-[#F7F4ED] focus:border-[#6857FF] focus:outline-none"
              />
            </div>

            {!clarificationLetter ? (
              <button
                onClick={handleGenerateDraft}
                disabled={isGeneratingDraft}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6857FF] to-[#5143E0] hover:from-[#7869FF] hover:to-[#6052F0] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#48D9E8]" />
                <span>{isGeneratingDraft ? 'Drafting Clarification Letter...' : 'Generate Factual Clarification Draft'}</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="parchment-surface rounded-xl p-4 font-mono text-xs text-stone-900 max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-stone-300">
                  {clarificationLetter}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLetter}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#111936] hover:bg-[#18234D] text-[#F7F4ED] border border-[#1E294B] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {hasCopiedLetter ? <Check className="w-3.5 h-3.5 text-[#2ECC9A]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedLetter ? 'Letter Copied to Clipboard' : 'Copy Draft Letter'}</span>
                  </button>
                  <button
                    onClick={handleGenerateDraft}
                    className="py-2 px-3 rounded-lg bg-[#070B18] text-[#8E98B7] hover:text-[#F7F4ED] border border-[#1E294B] text-xs"
                    title="Regenerate"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* HUMAN ESCALATION COMPASS */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E294B] pb-3">
              <Compass className="w-4 h-4 text-[#2ECC9A]" />
              <h3 className="text-sm font-semibold text-[#F7F4ED]">Human Escalation Compass</h3>
            </div>

            <p className="text-xs text-[#8E98B7] leading-relaxed">
              When internal clarifications fail or deadlines are imminent, seek appropriate institutional or independent assistance:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] space-y-1">
                <span className="font-semibold text-[#F7F4ED] block">1. Departmental Student / Program Advisor</span>
                <p className="text-[#8E98B7] text-[11px]">Best for informal file checks, transcript credit verification, and course prerequisite questions.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] space-y-1">
                <span className="font-semibold text-[#F7F4ED] block">2. University or Agency Ombudsperson</span>
                <p className="text-[#8E98B7] text-[11px]">Independent, neutral official who investigates procedural irregularities and administrative delays.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] space-y-1">
                <span className="font-semibold text-[#F7F4ED] block">3. Community Legal Aid Clinic</span>
                <p className="text-[#8E98B7] text-[11px]">Non-profit legal aid providing free guidance for public benefits, housing denials, or low-income appeals.</p>
              </div>

              <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B] space-y-1">
                <span className="font-semibold text-[#F7F4ED] block">4. Qualified Legal Practitioner</span>
                <p className="text-[#8E98B7] text-[11px]">Recommended if dealing with immigration status, eviction, licensure revocation, or formal administrative hearings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
