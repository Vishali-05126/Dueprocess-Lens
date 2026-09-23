import React, { useState } from 'react';
import { CaseFile, TransparencyReportData } from '../../types';
import { 
  FolderHeart, Calendar, Building2, Download, Printer, Trash2, 
  Clock, CheckCircle2, AlertTriangle, FileText, ArrowRight, 
  Share2, Sparkles, Scale, AlertCircle, Edit3, Database, Bot, LogIn 
} from 'lucide-react';
import { SafetyBanner } from '../common/SafetyBanner';
import { useAuth } from '../../context/AuthContext';

interface CaseFilePageProps {
  currentCase: CaseFile;
  savedCases?: CaseFile[];
  onSelectSavedCase?: (c: CaseFile) => void;
  onUpdateCase: (updated: CaseFile) => void;
  onDeleteCase: () => void;
  onNavigateToReport: () => void;
  onNavigateToChat?: () => void;
}

export const CaseFilePage: React.FC<CaseFilePageProps> = ({ 
  currentCase, 
  savedCases = [],
  onSelectSavedCase,
  onUpdateCase, 
  onDeleteCase,
  onNavigateToReport,
  onNavigateToChat 
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notes, setNotes] = useState(currentCase.notes || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(currentCase.title);
  const [status, setStatus] = useState<CaseFile['status']>(currentCase.status);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveNotes = () => {
    onUpdateCase({
      ...currentCase,
      notes,
      title,
      status,
      activityTimeline: [
        ...currentCase.activityTimeline,
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Notes updated',
          detail: 'User updated personal case file notes.'
        }
      ]
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DueProcessLens_CaseFile_${currentCase.referenceNumber || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportChecklistText = () => {
    const items = currentCase.report?.action_checklist || [];
    const textContent = `DUEPROCESS LENS — PREPARATION CHECKLIST
Case: ${currentCase.title}
Institution: ${currentCase.institution}
Reference: ${currentCase.referenceNumber}
Key Deadline: ${currentCase.keyDeadline}

${items.map((item, i) => `[${item.completed ? 'X' : ' '}] ${i + 1}. (${item.phase}) ${item.task}\n    Detail: ${item.detail}`).join('\n\n')}

DISCLAIMER: This is general legal information and document organization. It is not legal advice.`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DueProcessLens_ActionPlan_${currentCase.referenceNumber || 'checklist'}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SafetyBanner />

      {/* Cloud Sync Status & Saved Cases Carousel if logged in */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0F162E] border border-[#1E294B]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2ECC9A]/15 border border-[#2ECC9A]/30 flex items-center justify-center text-[#2ECC9A]">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#F7F4ED]">Firestore Case Vault</span>
              {user ? (
                <span className="text-[10px] font-mono text-[#2ECC9A] bg-[#2ECC9A]/15 px-2 py-0.5 rounded">
                  Connected: {user.email}
                </span>
              ) : (
                <span className="text-[10px] font-mono text-[#F4B942] bg-[#F4B942]/15 px-2 py-0.5 rounded">
                  Local Session (Sign In to Sync)
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#8E98B7]">
              {user 
                ? 'Your audited notices, notes, and activity timeline persist securely across sessions.'
                : 'Sign in with Google to persist your case files across devices in Firestore.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            savedCases.length > 1 && onSelectSavedCase && (
              <select
                onChange={(e) => {
                  const found = savedCases.find(c => c.id === e.target.value);
                  if (found) onSelectSavedCase(found);
                }}
                value={currentCase.id}
                className="text-xs bg-[#111936] border border-[#1E294B] rounded-lg px-2.5 py-1.5 text-[#F7F4ED]"
              >
                {savedCases.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            )
          ) : (
            <button
              onClick={signInWithGoogle}
              className="px-3 py-1.5 text-xs font-semibold text-[#F7F4ED] bg-[#6857FF]/20 hover:bg-[#6857FF]/30 border border-[#6857FF]/40 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5 text-[#48D9E8]" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Case Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1E294B] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#48D9E8] bg-[#111936] px-2.5 py-0.5 rounded border border-[#1E294B]">
              {currentCase.category}
            </span>
            <span className="text-xs text-[#8E98B7]">Ref: {currentCase.referenceNumber || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                className="text-2xl sm:text-3xl font-serif text-[#F7F4ED] bg-[#070B18] border border-[#6857FF] rounded-lg px-2 py-1 focus:outline-none"
                autoFocus
              />
            ) : (
              <h1 
                onClick={() => setIsEditingTitle(true)}
                className="text-2xl sm:text-3xl font-serif text-[#F7F4ED] hover:text-[#48D9E8] cursor-pointer flex items-center gap-2"
                title="Click to edit case title"
              >
                <span>{title}</span>
                <Edit3 className="w-4 h-4 text-[#8E98B7] opacity-60" />
              </h1>
            )}
          </div>

          <p className="text-xs text-[#8E98B7] flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-[#6857FF]" /> {currentCase.institution}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#48D9E8]" /> Date: {currentCase.dateReceived}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#FF6B6B]" /> Deadline: {currentCase.keyDeadline}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          {onNavigateToChat && (
            <button
              onClick={onNavigateToChat}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#6857FF] to-[#5143E0] hover:from-[#7869FF] hover:to-[#6052F0] rounded-lg shadow-sm shadow-[#6857FF]/30 transition-all flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-[#48D9E8]" />
              <span>Discuss with AI Advisor</span>
            </button>
          )}

          <button
            onClick={handlePrintPDF}
            className="px-3 py-2 text-xs font-medium text-[#F7F4ED] bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-[#48D9E8]" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={handleExportChecklistText}
            className="px-3 py-2 text-xs font-medium text-[#F7F4ED] bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#2ECC9A]" />
            <span>Checklist</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 text-xs font-medium text-[#F7F4ED] bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#6857FF]" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-2 text-xs font-medium text-[#FF8585] bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Overview & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Report Summary & Personal Case Notes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Transparency Snapshot */}
          {currentCase.report && (
            <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#48D9E8]" />
                  <h3 className="text-sm font-semibold text-[#F7F4ED]">Transparency Audit Snapshot</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8E98B7]">Clarity Score:</span>
                  <span className="font-mono text-sm font-bold text-[#F4B942]">
                    {currentCase.report.clarity_score}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B]">
                  <span className="text-[10px] text-[#8E98B7] block uppercase">Reason Clarity</span>
                  <span className="text-[#F4B942] capitalize">{currentCase.report.transparency_audit.reason.status}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B]">
                  <span className="text-[10px] text-[#8E98B7] block uppercase">Evidence Itemized</span>
                  <span className="text-[#FF8585] capitalize">{currentCase.report.transparency_audit.evidence.status}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#070B18] border border-[#1E294B]">
                  <span className="text-[10px] text-[#8E98B7] block uppercase">Filing Deadline</span>
                  <span className="text-[#FF6B6B] capitalize">{currentCase.report.transparency_audit.deadline.status}</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={onNavigateToReport}
                  className="text-xs text-[#48D9E8] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Open Full Six-Point Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* User Case Notes */}
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
              <h3 className="text-sm font-semibold text-[#F7F4ED] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6857FF]" />
                <span>Private Case Notes & Investigation Records</span>
              </h3>
              <span className="text-[11px] text-[#8E98B7]">
                {user ? 'Synced to Firestore' : 'Stored in browser'}
              </span>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record notes from conversations with admissions advisors, ombudsperson meetings, dates documents were submitted, or questions to ask..."
              rows={6}
              className="w-full text-xs font-mono bg-[#070B18] border border-[#1E294B] rounded-xl p-3 text-[#F7F4ED] focus:border-[#6857FF] focus:outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8E98B7]">Case Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="text-xs bg-[#070B18] border border-[#1E294B] rounded-lg px-2.5 py-1 text-[#F7F4ED]"
                >
                  <option value="Draft">Draft</option>
                  <option value="Analyzed">Analyzed</option>
                  <option value="Questions Prepared">Questions Prepared</option>
                  <option value="Followed Up">Followed Up</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {savedNotification && (
                  <span className="text-xs text-[#2ECC9A] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6857FF] hover:bg-[#7869FF] rounded-lg transition-colors"
                >
                  Save Notes & Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Case Activity Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E294B] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#48D9E8]" />
                <h3 className="text-sm font-semibold text-[#F7F4ED]">Activity Timeline</h3>
              </div>
              <span className="text-[11px] font-mono text-[#8E98B7]">Case History</span>
            </div>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E294B]">
              {currentCase.activityTimeline.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start gap-4 relative pl-6">
                  <div className="w-2 h-2 rounded-full bg-[#48D9E8] absolute left-1 top-1.5 -translate-x-1/2 ring-4 ring-[#0F162E]" />
                  <div className="flex-1 space-y-0.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#F7F4ED]">{item.action}</span>
                      <span className="text-[10px] font-mono text-[#8E98B7]">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#8E98B7] leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DESTRUCTIVE DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-[#0B1020]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#0F162E] border border-[#FF6B6B]/40 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center text-[#FF6B6B] mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-serif font-medium text-[#F7F4ED]">Delete Case File Permanently?</h3>
              <p className="text-xs text-[#8E98B7] leading-relaxed">
                This will permanently delete this case file, all saved notes, uploaded document fragments, and audit checklists. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E294B]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#8E98B7] hover:text-[#F7F4ED]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  onDeleteCase();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#FF6B6B] hover:bg-[#FF8585] rounded-lg transition-colors"
              >
                Yes, Delete Case File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
