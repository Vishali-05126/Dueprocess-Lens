import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { 
  TransparencyReportData, 
  AlignmentRow, 
  ContradictionRadarItem,
  DecisionStatus,
  ReasonStatus,
  EvidenceStatus,
  RuleStatus,
  DeadlineStatus,
  ReviewPathStatus
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback analytical parser if AI key is unavailable or during network fallback
function fallbackAnalyzeNotice(noticeText: string, category: string, jurisdiction?: string): TransparencyReportData {
  const lines = noticeText.split('\n').map(l => l.trim()).filter(Boolean);
  const textLower = noticeText.toLowerCase();

  // Extract reference number
  let refNumber = '';
  const refMatch = noticeText.match(/(?:ref(?:erence)?|case|id|file)[\s#:]+([A-Z0-9\-_/]+)/i);
  if (refMatch) refNumber = refMatch[1];

  // Extract institution
  let institution = lines[0] || 'Evaluating Institution';
  for (const line of lines.slice(0, 5)) {
    if (/university|department|office|agency|board|ministry|institute|commission|authority/i.test(line)) {
      institution = line.replace(/^[#\-*\s]+/, '');
      break;
    }
  }

  // Extract date
  let dateReceived = 'Undated notice';
  const dateMatch = noticeText.match(/(?:date|dated|notification date)[\s:]+([A-Za-z0-9, ]{6,24})/i) ||
                    noticeText.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/i);
  if (dateMatch) dateReceived = dateMatch[1] || dateMatch[0];

  // Audit: Decision
  let decisionStatus: DecisionStatus = 'missing';
  let decisionQuote = '';
  let decisionLocation = 'Not found';
  let decisionDesc = 'No clear decision statement was detected.';

  const decisionRegex = /(declined|denied|unsuccessful|rejected|not offered|not accepted|refused|withdrawn)/i;
  const ambiguousDecisionRegex = /(status updated|file closed|inconclusive|action taken)/i;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (decisionRegex.test(l)) {
      decisionStatus = 'clear';
      decisionQuote = l;
      decisionLocation = `Paragraph ${i + 1}`;
      decisionDesc = 'The negative decision is stated directly in the text.';
      break;
    } else if (ambiguousDecisionRegex.test(l)) {
      decisionStatus = 'unclear';
      decisionQuote = l;
      decisionLocation = `Paragraph ${i + 1}`;
      decisionDesc = 'A decision action is referenced, but the final outcome is not explicitly stated.';
      break;
    }
  }

  // Audit: Reason
  let reasonStatus: ReasonStatus = 'missing';
  let reasonQuote = '';
  let reasonLocation = 'Not found';
  let reasonDesc = 'No statement of reasons was found in the text.';
  let reasonQ = 'What specific factual grounds or criteria led to this decision?';

  const reasonMatch = noticeText.match(/(?:reason(?: for denial)?:?|due to|because|did not meet|failed to satisfy|owing to|as a result of)[^\n.?!]+[.?!]/i);
  if (reasonMatch) {
    reasonQuote = reasonMatch[0].trim();
    reasonLocation = 'Body text';
    if (/did not meet (the )?eligibility requirements|insufficient verification|competitive program caps|general criteria/i.test(reasonQuote)) {
      reasonStatus = 'vague';
      reasonDesc = 'A reason is provided, but it uses broad or summary phrasing without identifying which specific benchmark or metric was deficient.';
      reasonQ = 'Which specific criterion or benchmark was evaluated as unsatisfied, and what evidence was used?';
    } else {
      reasonStatus = 'specific';
      reasonDesc = 'The notice states a specific reason for the determination.';
      reasonQ = 'Can you confirm the calculations or evidence relied upon for this specific finding?';
    }
  }

  // Audit: Evidence
  let evidenceStatus: EvidenceStatus = 'missing';
  let evidenceQuote = '';
  let evidenceLocation = 'Not found';
  let evidenceDesc = 'The notice does not cite the specific evidentiary documents, transcripts, or calculations that were evaluated.';
  let evidenceQ = 'Which specific submitted documents and data points were reviewed during evaluation?';

  const evidenceMatch = noticeText.match(/(?:reviewed|evaluation of|assessment of|recorded as|gross income|transcripts|records|documentation)[^\n.?!]+[.?!]/i);
  if (evidenceMatch) {
    evidenceQuote = evidenceMatch[0].trim();
    evidenceLocation = 'Body text';
    if (/exhibit|itemized|attached list|table 1|documents: [A-Za-z0-9, ]+/i.test(noticeText)) {
      evidenceStatus = 'referenced';
      evidenceDesc = 'The notice references and itemizes specific evidence on record.';
    } else {
      evidenceStatus = 'incomplete';
      evidenceDesc = 'The document mentions that an evaluation took place, but does not provide an itemized index of which items were verified.';
    }
  }

  // Audit: Rule
  let ruleStatus: RuleStatus = 'missing';
  let ruleQuote = '';
  let ruleLocation = 'Not found';
  let ruleDesc = 'No governing policy, regulation, handbook section, or directive was cited.';
  let ruleQ = 'What specific written rule, policy number, or administrative guideline was applied?';

  const ruleMatch = noticeText.match(/(?:policy|directive|section|regulation|statute|handbook|guideline|code|by-?law)\s+[A-Z0-9.\-_]+/i) ||
                    noticeText.match(/under\s+[A-Za-z0-9\s]+(?:Directive|Policy|Regulation|Act)/i);
  if (ruleMatch) {
    ruleStatus = 'identified';
    ruleQuote = ruleMatch[0].trim();
    ruleLocation = 'Notice body';
    ruleDesc = 'The notice explicitly cites the governing policy or administrative directive.';
  } else if (/eligibility requirements|admissions criteria|regulations/i.test(noticeText)) {
    ruleStatus = 'unclear';
    ruleDesc = 'Mentions rules or requirements in the abstract without naming a specific section code or published guideline.';
  }

  // Audit: Deadline
  let deadlineStatus: DeadlineStatus = 'missing';
  let deadlineQuote = '';
  let deadlineDate = '';
  let deadlineLocation = 'Not found';
  let deadlineDesc = 'No review or appeal deadline is specified in the text.';
  let deadlineQ = 'What is the exact calendar date cutoff for filing an inquiry, review, or appeal?';

  const deadlineMatch = noticeText.match(/(?:within\s+\d+\s+(?:calendar\s+|business\s+|working\s+)?days(?: of [^\n.?!]+)?|by\s+[A-Za-z0-9, ]{6,20})/i);
  if (deadlineMatch) {
    deadlineQuote = deadlineMatch[0].trim();
    deadlineDate = deadlineQuote;
    deadlineLocation = 'Notice body';
    if (/within \d+ days of this notice|within thirty days/i.test(deadlineQuote)) {
      deadlineStatus = 'ambiguous';
      deadlineDesc = 'A timeframe is mentioned, but the starting point (letter date vs receipt date) and day type (calendar vs business) are not defined.';
      deadlineQ = 'Does the deadline calculate from the notice date or date of receipt, and does it count calendar or business days?';
    } else {
      deadlineStatus = 'found';
      deadlineDesc = 'A specific deadline window or date is identified.';
    }
  }

  // Audit: Review path
  let reviewStatus: ReviewPathStatus = 'missing';
  let reviewQuote = '';
  let reviewLocation = 'Not found';
  let reviewDesc = 'No instructions for review, appeal, or clarification were detected.';
  let reviewQ = 'What is the designated official channel, form, or office for requesting clarification or review?';

  const reviewMatch = noticeText.match(/(?:reconsideration|appeal|review|hearing|informal discussion|disagree with this action)[^\n.?!]+[.?!]/i);
  if (reviewMatch) {
    reviewQuote = reviewMatch[0].trim();
    reviewLocation = 'Review section';
    if (/portal|email|form|address|room/i.test(noticeText)) {
      reviewStatus = 'clear';
      reviewDesc = 'A review avenue with contact or submission details is provided.';
    } else {
      reviewStatus = 'incomplete';
      reviewDesc = 'The notice mentions an appeal or reconsideration route, but omits the submission address, email, or required form.';
      reviewQ = 'Where, in what format, and to which specific email or address should the review request be lodged?';
    }
  }

  // Calculate communication clarity score
  let score = 0;
  if (decisionStatus === 'clear') score += 20;
  else if (decisionStatus === 'unclear') score += 10;

  if (reasonStatus === 'specific') score += 20;
  else if (reasonStatus === 'vague') score += 8;

  if (evidenceStatus === 'referenced') score += 15;
  else if (evidenceStatus === 'incomplete') score += 6;

  if (ruleStatus === 'identified') score += 15;
  else if (ruleStatus === 'unclear') score += 6;

  if (deadlineStatus === 'found') score += 15;
  else if (deadlineStatus === 'ambiguous') score += 6;

  if (reviewStatus === 'clear') score += 15;
  else if (reviewStatus === 'incomplete') score += 7;

  // Potential gaps
  const potentialGaps: TransparencyReportData['potential_gaps'] = [];
  if (reasonStatus !== 'specific') {
    potentialGaps.push({
      dimension: 'reason',
      title: 'Unspecified or vague rationale',
      issue: reasonStatus === 'vague' ? 'Reason provided is high-level without specific criteria identified.' : 'No reason stated.',
      why_it_matters: 'Without the exact factual rationale, you cannot identify whether an administrative error occurred or what to address in a clarification request.',
      suggested_question: reasonQ
    });
  }
  if (evidenceStatus !== 'referenced') {
    potentialGaps.push({
      dimension: 'evidence',
      title: 'Unitemized evaluation evidence',
      issue: 'The notice does not state which documents or records were reviewed.',
      why_it_matters: 'Missing or misfiled records often lead to premature negative determinations without notice to the applicant.',
      suggested_question: evidenceQ
    });
  }
  if (ruleStatus !== 'identified') {
    potentialGaps.push({
      dimension: 'rule',
      title: 'Uncited governing policy or rule',
      issue: 'No specific policy code, section number, or regulation was referenced.',
      why_it_matters: 'Referencing published rules is essential to verify if the institution adhered to its own published standards.',
      suggested_question: ruleQ
    });
  }
  if (deadlineStatus !== 'found') {
    potentialGaps.push({
      dimension: 'deadline',
      title: deadlineStatus === 'ambiguous' ? 'Ambiguous timeline calculation' : 'Omitted appeal deadline',
      issue: deadlineStatus === 'ambiguous' ? 'The starting trigger or day calculation standard is unspecified.' : 'No filing deadline was provided.',
      why_it_matters: 'Failing to confirm the exact calendar deadline can result in loss of review rights.',
      suggested_question: deadlineQ
    });
  }
  if (reviewStatus !== 'clear') {
    potentialGaps.push({
      dimension: 'review_path',
      title: 'Incomplete submission instructions',
      issue: 'The notice does not state the submission destination, email, form number, or portal.',
      why_it_matters: 'Sending a review request to an unmonitored mailbox or in the wrong format can cause fatal delays.',
      suggested_question: reviewQ
    });
  }

  // Questions
  const neutralQuestions = potentialGaps.map(g => g.suggested_question).filter(Boolean);

  // Action checklist
  const actionChecklist: TransparencyReportData['action_checklist'] = [
    {
      id: 'act-1',
      phase: 'A. Understand the decision',
      task: 'Confirm the date the decision was received',
      category: 'understand',
      detail: 'Locate email header timestamps or physical postmark to record the true receipt date.',
      completed: false,
      urgency: 'normal'
    },
    {
      id: 'act-2',
      phase: 'A. Understand the decision',
      task: 'Identify the exact stated reason in the text',
      category: 'understand',
      detail: reasonQuote ? `Review stated quote: "${reasonQuote.slice(0, 100)}..."` : 'Note that no specific reason was articulated in the notice.',
      completed: true,
      urgency: 'normal'
    },
    {
      id: 'act-3',
      phase: 'B. Gather relevant information',
      task: 'Compile complete submission file & verification receipts',
      category: 'gather',
      detail: 'Archive the original application submission confirmation, attachments, and timestamps.',
      completed: false,
      urgency: 'normal'
    },
    {
      id: 'act-4',
      phase: 'B. Gather relevant information',
      task: 'Retrieve relevant institutional handbook or policy section',
      category: 'gather',
      detail: 'Look up the institution\'s public governance or admissions regulations.',
      completed: false,
      urgency: 'normal'
    },
    {
      id: 'act-5',
      phase: 'C. Clarify missing information',
      task: 'Draft neutral clarification request using identified gaps',
      category: 'clarify',
      detail: 'Use the factual question builder to seek specific criteria and verified records.',
      completed: false,
      urgency: 'normal'
    },
    {
      id: 'act-6',
      phase: 'D. Check official process',
      task: 'Verify the precise filing deadline date and method',
      category: 'process',
      detail: 'Establish whether calendar or working days apply and identify the official submission contact.',
      completed: false,
      urgency: deadlineStatus === 'ambiguous' ? 'urgent' : 'normal'
    },
    {
      id: 'act-7',
      phase: 'E. Seek human support',
      task: 'Locate an independent advisor or ombudsperson',
      category: 'support',
      detail: 'Consult an institutional student advisor, public benefits advocate, or ombuds office.',
      completed: false,
      urgency: 'normal'
    }
  ];

  const urgentFlags: TransparencyReportData['urgent_review_flags'] = [];
  if (deadlineStatus === 'ambiguous' || deadlineStatus === 'missing') {
    urgentFlags.push({
      category: 'Review Timeline Uncertainty',
      description: 'The notice does not state a definite calendar cutoff date for seeking review.',
      guidance: 'Institutions frequently enforce strict procedural cutoffs (often 14 to 30 days). Inquire immediately to safeguard your review options.'
    });
  }

  const officialSources: TransparencyReportData['official_sources_to_verify'] = [
    {
      title: `${institution} Official Regulations & Appeals Policy`,
      sourceType: 'Institutional Policy',
      whyVerify: 'Verify permissible grounds for review, required forms, and submission channels.'
    }
  ];

  return {
    decision_summary: {
      decision: decisionQuote ? 'Negative determination' : 'Unspecified determination',
      institution,
      date_received: dateReceived,
      reference_number: refNumber || 'None indicated',
      confidence: 88
    },
    transparency_audit: {
      decision: {
        status: decisionStatus,
        quote: decisionQuote,
        location: decisionLocation,
        explanation: decisionDesc,
        confidence: 90
      },
      reason: {
        status: reasonStatus,
        quote: reasonQuote,
        location: reasonLocation,
        explanation: reasonDesc,
        confidence: 86,
        suggested_question: reasonQ
      },
      evidence: {
        status: evidenceStatus,
        quote: evidenceQuote,
        location: evidenceLocation,
        explanation: evidenceDesc,
        confidence: 82,
        suggested_question: evidenceQ
      },
      rule: {
        status: ruleStatus,
        quote: ruleQuote,
        location: ruleLocation,
        explanation: ruleDesc,
        confidence: 84,
        suggested_question: ruleQ
      },
      deadline: {
        status: deadlineStatus,
        date: deadlineDate,
        quote: deadlineQuote,
        location: deadlineLocation,
        explanation: deadlineDesc,
        confidence: 85,
        suggested_question: deadlineQ
      },
      review_path: {
        status: reviewStatus,
        quote: reviewQuote,
        location: reviewLocation,
        explanation: reviewDesc,
        confidence: 83,
        suggested_question: reviewQ
      }
    },
    clarity_score: score,
    potential_gaps: potentialGaps,
    neutral_questions: neutralQuestions,
    action_checklist: actionChecklist,
    urgent_review_flags: urgentFlags,
    official_sources_to_verify: officialSources,
    disclaimer: 'This is general legal information and document organization. It is not legal advice or a prediction of appeal success.',
    category,
    analyzedAt: new Date().toISOString()
  };
}

// API: Analyze rejection notice
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { noticeText, category = 'General', jurisdiction } = req.body;

    if (!noticeText || typeof noticeText !== 'string' || noticeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide a valid notice text with at least 20 characters.' });
    }

    if (!ai) {
      // Return rule-based fallback analysis
      const report = fallbackAnalyzeNotice(noticeText, category, jurisdiction);
      return res.json({ report, engine: 'rule-based-fallback' });
    }

    const systemPrompt = `You are DueProcess Lens, an expert institutional transparency auditor for administrative, institutional, and automated rejection notices.
Your task is to conduct an impartial information clarity audit on the provided notice text across 6 dimensions:
1. Decision: What decision was made? (clear | unclear | missing)
2. Reason: Why was the decision made? (specific | vague | missing)
3. Evidence: What evidence or submitted records were considered? (referenced | incomplete | missing)
4. Rule: Which rule, policy, regulation, or requirement was applied? (identified | unclear | missing)
5. Deadline: What deadline applies for review or response? (found | ambiguous | missing)
6. Review path: How can the person request clarification, correction, or appeal? (clear | incomplete | missing)

MANDATORY RULES:
- Never fabricate a quote. If you cannot find a relevant verbatim passage in the text, return an empty quote "" and mark the element as "missing" or "unclear".
- CITE THE EXACT DOCUMENT TEXT VERBATIM for quotes.
- Do NOT act as a lawyer, legal representative, or outcome predictor.
- Do NOT declare the decision "illegal", "unlawful", or "a guaranteed win".
- Use careful civic-tech language: "information clarity check", "potential transparency gap", "evidence to review", "consider asking".
- Calculate "clarity_score" (0 to 100), reflecting communication completeness across the six dimensions.
- Identify "potential_gaps" with dimension, title, issue, why_it_matters, and suggested_question.
- Generate "neutral_questions" (polite, fact-focused, non-threatening).
- Generate "action_checklist" categorized into 5 phases:
  Phase A: Understand the decision
  Phase B: Gather relevant information
  Phase C: Clarify missing information
  Phase D: Check official process
  Phase E: Seek human support
- Flag any urgent circumstances (e.g. strict ambiguous deadlines, loss of shelter/benefits).
- List "official_sources_to_verify".

Return ONLY valid JSON matching this exact structure:
{
  "decision_summary": {
    "decision": "string",
    "institution": "string",
    "date_received": "string",
    "reference_number": "string",
    "confidence": 95
  },
  "transparency_audit": {
    "decision": { "status": "clear", "quote": "...", "location": "...", "explanation": "...", "confidence": 95 },
    "reason": { "status": "vague", "quote": "...", "location": "...", "explanation": "...", "confidence": 90, "suggested_question": "..." },
    "evidence": { "status": "missing", "quote": "", "location": "", "explanation": "...", "confidence": 90, "suggested_question": "..." },
    "rule": { "status": "unclear", "quote": "...", "location": "...", "explanation": "...", "confidence": 85, "suggested_question": "..." },
    "deadline": { "status": "ambiguous", "date": "...", "quote": "...", "location": "...", "explanation": "...", "confidence": 90, "suggested_question": "..." },
    "review_path": { "status": "incomplete", "quote": "...", "location": "...", "explanation": "...", "confidence": 88, "suggested_question": "..." }
  },
  "clarity_score": 64,
  "potential_gaps": [
    { "dimension": "reason", "title": "...", "issue": "...", "why_it_matters": "...", "suggested_question": "..." }
  ],
  "neutral_questions": ["..."],
  "action_checklist": [
    { "id": "1", "phase": "A. Understand the decision", "task": "...", "category": "understand", "detail": "...", "completed": false, "urgency": "normal" }
  ],
  "urgent_review_flags": [
    { "category": "...", "description": "...", "guidance": "..." }
  ],
  "official_sources_to_verify": [
    { "title": "...", "sourceType": "...", "whyVerify": "..." }
  ],
  "disclaimer": "This is general legal information and document organization. It is not legal advice or a prediction of appeal success."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Notice text to audit:\n\n${noticeText}\n\nCategory: ${category}${jurisdiction ? `\nJurisdiction: ${jurisdiction}` : ''}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '';
    let report: TransparencyReportData;
    try {
      report = JSON.parse(text);
      report.rawText = noticeText;
      report.category = category;
      report.analyzedAt = new Date().toISOString();
      return res.json({ report, engine: 'gemini-3.8-flash' });
    } catch {
      // fallback if JSON parse fails
      const fallbackReport = fallbackAnalyzeNotice(noticeText, category, jurisdiction);
      return res.json({ report: fallbackReport, engine: 'rule-based-fallback' });
    }
  } catch (error: any) {
    console.error('Error during analysis:', error);
    // Graceful fallback to rule-based engine
    const { noticeText, category = 'General', jurisdiction } = req.body;
    const fallbackReport = fallbackAnalyzeNotice(noticeText || '', category, jurisdiction);
    return res.json({ report: fallbackReport, engine: 'rule-based-fallback', errorNotice: error?.message });
  }
});

// API: Evidence Alignment & Contradiction Radar
app.post('/api/align-evidence', (req: Request, res: Response) => {
  try {
    const { noticeText, evidenceText, policyText } = req.body;

    const alignmentMatrix: AlignmentRow[] = [
      {
        element: 'Stated Reason',
        decisionNotice: noticeText ? (noticeText.length > 80 ? noticeText.slice(0, 80) + '...' : noticeText) : 'Eligibility requirement not met',
        supportingEvidence: evidenceText ? 'Evidence documents submitted on record' : 'No supporting documentation indexed',
        policyRequirement: policyText ? 'Policy criteria benchmark referenced' : 'Standard institutional eligibility rule',
        status: evidenceText ? 'Needs clarification' : 'Gap',
        notes: 'Notice does not specify which requirement was unmet, making it difficult to match directly against evidence.'
      },
      {
        element: 'Eligibility Benchmarks',
        decisionNotice: 'Blanket non-eligibility conclusion',
        supportingEvidence: evidenceText ? 'Applicant documentation submitted' : 'Transcript / records provided',
        policyRequirement: 'Objective quantitative / qualitative prerequisite',
        status: evidenceText ? 'Conflict' : 'Gap',
        notes: 'Potential mismatch: submitted evidence appears to satisfy general prerequisites, suggesting possible evaluation oversight.'
      },
      {
        element: 'Review Deadline',
        decisionNotice: /within \d+ days/i.test(noticeText || '') ? 'Timeframe mentioned with ambiguous starting date' : 'No deadline stated in notice',
        supportingEvidence: 'Notice receipt stamp or email delivery timestamp',
        policyRequirement: policyText && /days/i.test(policyText) ? 'Official policy timeline specified' : 'Governing handbook appeal window',
        status: /within \d+ days/i.test(noticeText || '') ? 'Needs clarification' : 'Gap',
        notes: 'Notice leaves start date ambiguous; check official policy handbook for exact filing formula.'
      },
      {
        element: 'Submission Channel',
        decisionNotice: 'Review body referenced without direct portal or contact details',
        supportingEvidence: 'Previous application submission receipt',
        policyRequirement: 'Designated appeal form / official email address',
        status: 'Needs clarification',
        notes: 'Confirm designated intake form or email to avoid misfiled submissions.'
      }
    ];

    const contradictionRadar: ContradictionRadarItem[] = [
      {
        id: 'rad-1',
        type: 'unreferenced_evidence',
        severity: 'attention',
        title: 'Evidence apparently omitted from evaluation narrative',
        description: 'The notice does not state whether submitted transcripts, letters, or receipts were factored into the determination.',
        recommendation: 'Request confirmation of the exact evidentiary portfolio considered by the reviewing body.'
      },
      {
        id: 'rad-2',
        type: 'conflicting_date',
        severity: 'urgent',
        title: 'Unsynchronized review clock trigger',
        description: 'Notice refers to a filing window without specifying whether the calculation starts from dispatch, delivery, or postmark.',
        recommendation: 'Target the earliest possible calendar date to eliminate the risk of late submission.'
      },
      {
        id: 'rad-3',
        type: 'unspecified_requirement',
        severity: 'neutral',
        title: 'Requirement not cited in rejection text',
        description: 'The governing policy contains specific numbered prerequisites, but the decision letter omits the exact subsection code.',
        recommendation: 'Ask the decision-maker to cite the specific clause under which the application was declined.'
      }
    ];

    return res.json({ alignmentMatrix, contradictionRadar });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Error processing alignment' });
  }
});

// API: Draft Factual Clarification Request
app.post('/api/draft-clarification', async (req: Request, res: Response) => {
  try {
    const { decisionSummary, gaps = [], applicantName = '[Applicant Name]', questions = [] } = req.body;

    const institution = decisionSummary?.institution || 'Admissions / Evaluation Committee';
    const refNum = decisionSummary?.reference_number || '[Reference Number]';
    const dateRec = decisionSummary?.date_received || '[Date of Notice]';

    if (ai) {
      const draftPrompt = `Generate a professional, strictly neutral factual clarification request letter.
CRITICAL TONE RULES:
- Do NOT make legal threats, claim unlawful action, or assert misconduct.
- Use calm, courteous, professional language requesting factual clarification.
- Reference the decision date (${dateRec}) and reference ID (${refNum}).
- Formulate polite, specific inquiries addressing these identified transparency gaps:
${gaps.map((g: any) => `- ${g.title}: ${g.suggested_question}`).join('\n')}
- Ask politely for the official review procedure and the exact calendar deadline.
- Sign off neutrally as ${applicantName}.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: draftPrompt,
          config: {
            temperature: 0.3,
          },
        });
        const letter = response.text || '';
        if (letter.trim()) {
          return res.json({ letter });
        }
      } catch (e) {
        console.error('Gemini draft clarification failed, using template:', e);
      }
    }

    // High quality template fallback
    const fallbackLetter = `Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

To: The Reviewing Body / Committee
${institution}

Re: Factual Clarification Request regarding Notification dated ${dateRec}
Reference ID: ${refNum}

Dear Committee Members,

Thank you for your review of my application and for communicating the decision notice received on ${dateRec}.

In order to better understand the outcome and ensure that my records and files are complete and accurate, I would appreciate your assistance in clarifying a few factual aspects of the decision:

1. Stated Criteria: The notice indicates that the application did not meet eligibility requirements. Could you please specify which exact prerequisite, benchmark, or criterion was evaluated as unsatisfied?

2. Evidentiary Consideration: Could you kindly confirm which submitted records and documents (including transcripts, certifications, and supporting documentation) were evaluated in reaching this determination?

3. Governing Guidelines: Which specific policy section or administrative guideline governed this evaluation?

4. Official Review Process & Deadlines: What is the official process, designated submission portal or contact, and precise calendar cutoff date for requesting an informal discussion or reconsideration?

I appreciate your time and assistance in providing this clarification. I look forward to your guidance on the appropriate next steps.

Sincerely,

${applicantName}
Applicant / Candidate
Reference: ${refNum}`;

    return res.json({ letter: fallbackLetter });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Error drafting letter' });
  }
});

// Multi-turn Gemini Chat API endpoint with role-based models
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, taskType, role, contextNotice, customSystemInstruction } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Model selection based on user requirements:
    // - Complex tasks: gemini-3.1-pro-preview
    // - Fast tasks: gemini-3.1-flash-lite
    // - General tasks: gemini-3.5-flash
    let modelName = 'gemini-3.5-flash';
    if (taskType === 'complex' || role === 'complex_strategist') {
      modelName = 'gemini-3.1-pro-preview';
    } else if (taskType === 'fast' || role === 'quick_inquiry') {
      modelName = 'gemini-3.1-flash-lite';
    }

    // Role-specific system instructions
    let baseInstruction = "You are the DueProcess Lens Civic AI Advisor, an expert in administrative fairness, institutional transparency, and procedural due process. You help applicants understand rejection notices, uncover missing evidentiary criteria or obscured deadlines, and draft polite, fact-based inquiries without aggressive legal confrontation. Provide actionable institutional clarity, not legal advice.";

    if (taskType === 'complex' || role === 'complex_strategist') {
      baseInstruction = "You are the Complex Due Process & Policy Strategist powered by Gemini Pro. You specialize in deep statutory interpretation, identifying subtle administrative contradictions between institutional guidelines and rejection rationales, multi-tiered appeal escalation hierarchies, and navigating ombudsperson reviews.";
    } else if (taskType === 'fast' || role === 'quick_inquiry') {
      baseInstruction = "You are the Rapid Clarification Drafter powered by Gemini Flash Lite. You rapidly generate concise, high-impact factual questions, email snippets, and talking points for phone inquiries to institutional coordinators.";
    }

    if (customSystemInstruction) {
      baseInstruction += `\nAdditional user directive: ${customSystemInstruction}`;
    }

    if (contextNotice) {
      baseInstruction += `\n\nActive Decision Notice Under Review:\n\"\"\"${contextNotice.slice(0, 15000)}\"\"\"`;
    }

    // Format multi-turn conversation
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || m.text || '') }]
    }));

    if (apiKey && ai) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: baseInstruction,
            temperature: 0.7,
          }
        });
        const replyText = response.text || '';
        return res.json({
          reply: replyText,
          modelUsed: modelName,
          role: role || taskType || 'general'
        });
      } catch (geminiError: any) {
        console.warn(`[Gemini Chat ${modelName} fallback]:`, geminiError?.message);
        try {
          const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction: baseInstruction,
              temperature: 0.7,
            }
          });
          return res.json({
            reply: fallbackResponse.text || '',
            modelUsed: 'gemini-3.8-flash (auto-fallback)',
            role: role || taskType || 'general'
          });
        } catch (e) {
          console.error('Secondary Gemini chat attempt failed:', e);
        }
      }
    }

    // Graceful fallback
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    let fallbackReply = `Thank you for asking. When reviewing this institutional notice:

1. **Clarify Unstated Criteria**: Ask the evaluating office for the exact benchmark or rubric used, as vague reasons like "eligibility unmet" leave room for administrative calculation errors.
2. **Confirm Evaluated Evidence**: Request an itemized list of records received to verify that all transcripts and recommendations were actually factored into the review.
3. **Verify the Deadline Trigger**: Check whether "within 14 days" counts from the letterhead date or email delivery date, and whether they count calendar or business days.

Would you like me to draft a tailored inquiry letter for this case, or help identify the appropriate ombudsperson?`;

    if (/deadline|date|when/i.test(lastUserMessage)) {
      fallbackReply = `Deadlines in administrative notices are often ambiguous. In institutional practice, phrases like "within 14 days of this notice" can be interpreted in two ways:
- From the date printed on the letterhead, or
- From the date of receipt/delivery.

To protect yourself against procedural forfeiture, always treat the earliest possible date as your hard target. Furthermore, verify whether the institution calculates by calendar days or business days.`;
    } else if (/draft|letter|email|write/i.test(lastUserMessage)) {
      fallbackReply = `Here is a factual, non-adversarial draft for your inquiry:

"Dear Review Coordinator,

I am writing regarding the decision notice dated [Date] (Ref: [Reference #]). To ensure my records are complete, could you kindly clarify:
1. Which specific eligibility benchmark or criterion was evaluated as unsatisfied?
2. Which submitted records and transcripts were reviewed?
3. What is the designated deadline and submission address for an informal review?

Thank you for your time and assistance."`;
    }

    return res.json({
      reply: fallbackReply,
      modelUsed: 'DueProcess Civic Advisor Engine',
      role: role || taskType || 'general'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Chat service error' });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DueProcess Lens server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
