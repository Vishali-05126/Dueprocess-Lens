export type DecisionStatus = 'clear' | 'unclear' | 'missing';
export type ReasonStatus = 'specific' | 'vague' | 'missing';
export type EvidenceStatus = 'referenced' | 'incomplete' | 'missing';
export type RuleStatus = 'identified' | 'unclear' | 'missing';
export type DeadlineStatus = 'found' | 'ambiguous' | 'missing';
export type ReviewPathStatus = 'clear' | 'incomplete' | 'missing';

export interface AuditElement<TStatus extends string> {
  status: TStatus;
  quote: string;
  location: string;
  explanation: string;
  confidence: number; // 0 to 100
  date?: string;
  suggested_question?: string;
}

export interface TransparencyAudit {
  decision: AuditElement<DecisionStatus>;
  reason: AuditElement<ReasonStatus>;
  evidence: AuditElement<EvidenceStatus>;
  rule: AuditElement<RuleStatus>;
  deadline: AuditElement<DeadlineStatus>;
  review_path: AuditElement<ReviewPathStatus>;
}

export interface DecisionSummary {
  decision: string;
  institution: string;
  date_received: string;
  reference_number: string;
  confidence: number;
}

export interface PotentialGap {
  dimension: 'decision' | 'reason' | 'evidence' | 'rule' | 'deadline' | 'review_path';
  title: string;
  issue: string;
  why_it_matters: string;
  suggested_question: string;
}

export interface ActionChecklistItem {
  id: string;
  phase: 'A. Understand the decision' | 'B. Gather relevant information' | 'C. Clarify missing information' | 'D. Check official process' | 'E. Seek human support';
  task: string;
  category: 'understand' | 'gather' | 'clarify' | 'process' | 'support';
  detail: string;
  completed: boolean;
  notes?: string;
  urgency?: 'normal' | 'urgent';
  dueDate?: string;
}

export interface UrgentReviewFlag {
  category: string;
  description: string;
  guidance: string;
}

export interface OfficialSourceToVerify {
  title: string;
  sourceType: string;
  whyVerify: string;
}

export interface TransparencyReportData {
  decision_summary: DecisionSummary;
  transparency_audit: TransparencyAudit;
  clarity_score: number; // 0-100 communication clarity
  potential_gaps: PotentialGap[];
  neutral_questions: string[];
  action_checklist: ActionChecklistItem[];
  urgent_review_flags: UrgentReviewFlag[];
  official_sources_to_verify: OfficialSourceToVerify[];
  disclaimer: string;
  rawText?: string;
  category?: string;
  analyzedAt?: string;
}

export interface AlignmentRow {
  element: string;
  decisionNotice: string;
  supportingEvidence: string;
  policyRequirement: string;
  status: 'Match' | 'Gap' | 'Conflict' | 'Needs clarification';
  notes: string;
}

export interface ContradictionRadarItem {
  id: string;
  type: 'conflicting_date' | 'name_mismatch' | 'reference_mismatch' | 'unreferenced_evidence' | 'unspecified_requirement';
  severity: 'attention' | 'neutral' | 'urgent';
  title: string;
  description: string;
  recommendation: string;
}

export interface CaseFile {
  id: string;
  title: string;
  category: string;
  institution: string;
  dateReceived: string;
  keyDeadline: string;
  referenceNumber: string;
  status: 'Draft' | 'Analyzed' | 'Questions Prepared' | 'Followed Up';
  notes: string;
  rawNotice?: string;
  report?: TransparencyReportData;
  activityTimeline: Array<{
    id: string;
    timestamp: string;
    action: string;
    detail: string;
  }>;
}
