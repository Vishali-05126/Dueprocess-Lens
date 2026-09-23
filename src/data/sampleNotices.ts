import { TransparencyReportData } from '../types';

export interface SampleNotice {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  institution: string;
  rawText: string;
  report: TransparencyReportData;
  mockEvidence?: string;
  mockPolicy?: string;
}

export const SAMPLE_NOTICES: SampleNotice[] = [
  {
    id: 'sample-scholarship',
    category: 'Scholarships',
    title: 'Northbridge Merit Scholarship Notice',
    subtitle: 'Institutional awards committee decision with missing eligibility criteria and ambiguous deadline',
    institution: 'Northbridge University',
    rawText: `NORTHBRIDGE UNIVERSITY
OFFICE OF STUDENT FINANCIAL SUPPORT & AWARDS
Date of Letter: October 14, 2025
Reference ID: NBU-SCH-2025-9921

Dear Applicant,

Re: Northbridge Merit & Civic Leadership Scholarship 2025–2026

Thank you for your application to the Northbridge Merit & Civic Leadership Scholarship program. We received a high volume of applications for this funding cycle.

We regret to inform you that your application was unsuccessful. Your application did not meet the eligibility requirements.

Decisions of the scholarship committee are made following an evaluation of submitted documentation.

If you wish to request a review of this decision, requests for reconsideration may be lodged with the Office of Academic Awards within 14 days of this notice.

Sincerely,
Awards Evaluation Committee
Northbridge University`,
    mockEvidence: `Applicant Profile & Evidence Provided:
- Cumulative GPA: 3.82 / 4.0 (Official Transcript attached, certified Sept 12, 2025)
- Documented 120 hours of volunteer service with Northbridge Youth Center
- Two letters of recommendation from Department Chairs
- Enrolled full-time (15 credit hours) for the Fall 2025 semester`,
    mockPolicy: `Northbridge University Scholarship Policy Section 3.1:
- Minimum cumulative GPA of 3.50 required for merit consideration
- Demonstrated minimum 50 hours of documented community engagement
- Must be enrolled in a minimum of 12 credits (full-time status)
- Reconsideration requests must be filed via Form SCH-Rev-1 to awards-review@northbridge.edu within 14 calendar days of email delivery`,
    report: {
      decision_summary: {
        decision: 'Scholarship application unsuccessful',
        institution: 'Northbridge University',
        date_received: 'October 14, 2025',
        reference_number: 'NBU-SCH-2025-9921',
        confidence: 96
      },
      transparency_audit: {
        decision: {
          status: 'clear',
          quote: 'We regret to inform you that your application was unsuccessful.',
          location: 'Paragraph 3, Line 1',
          explanation: 'The notification states the negative decision unambiguously in direct language.',
          confidence: 98
        },
        reason: {
          status: 'vague',
          quote: 'Your application did not meet the eligibility requirements.',
          location: 'Paragraph 3, Line 2',
          explanation: 'The notice relies on a generic conclusion without specifying which eligibility criterion (e.g., GPA threshold, credit load, citizenship, or volunteer hours) was not satisfied.',
          confidence: 94,
          suggested_question: 'Could you please identify the specific eligibility requirement that was determined not to have been satisfied in this evaluation?'
        },
        evidence: {
          status: 'missing',
          quote: '',
          location: 'Not found in document',
          explanation: 'The letter does not identify what specific documents, transcripts, or calculations were assessed during the evaluation.',
          confidence: 90,
          suggested_question: 'Which application materials and verified data points were reviewed by the awards committee in reaching this determination?'
        },
        rule: {
          status: 'unclear',
          quote: 'Decisions of the scholarship committee are made following an evaluation of submitted documentation.',
          location: 'Paragraph 4',
          explanation: 'The letter mentions "eligibility requirements" but does not cite any specific scholarship guideline, section code, or published regulation.',
          confidence: 88,
          suggested_question: 'What specific policy guideline or section of the Northbridge Scholarship Handbook governs this requirement?'
        },
        deadline: {
          status: 'ambiguous',
          date: 'Within 14 days of notice',
          quote: 'within 14 days of this notice',
          location: 'Paragraph 5',
          explanation: 'The timeframe does not clarify whether the 14 days run from the letter date (Oct 14), email dispatch date, or receipt date, nor does it specify business vs calendar days.',
          confidence: 92,
          suggested_question: 'Does the 14-day review window calculate from October 14 or date of receipt, and does it count calendar days or university business days?'
        },
        review_path: {
          status: 'incomplete',
          quote: 'requests for reconsideration may be lodged with the Office of Academic Awards',
          location: 'Paragraph 5',
          explanation: 'The notice refers to a review path but omits the required submission channel (email address, online portal, or physical office) and permissible grounds for review.',
          confidence: 91,
          suggested_question: 'What is the designated submission procedure, official form, or email destination for lodging a reconsideration request with the Office of Academic Awards?'
        }
      },
      clarity_score: 54,
      potential_gaps: [
        {
          dimension: 'reason',
          title: 'Unspecified eligibility requirement',
          issue: 'The statement "did not meet eligibility requirements" leaves the factual basis unknown.',
          why_it_matters: 'Without knowing which requirement failed, you cannot verify whether transcripts were misread or prerequisites miscalculated.',
          suggested_question: 'Which specific eligibility requirement (such as GPA, credit hours, or residency) was found unsatisfied?'
        },
        {
          dimension: 'evidence',
          title: 'Omission of evaluated records',
          issue: 'No reference to which transcripts or recommendation letters were checked.',
          why_it_matters: 'An incomplete file review or lost attachment can result in a false eligibility failure.',
          suggested_question: 'Can you confirm that all submitted transcripts and supporting recommendation letters were included in the evaluation file?'
        },
        {
          dimension: 'deadline',
          title: 'Ambiguous timeline trigger',
          issue: '"Within 14 days of this notice" is legally ambiguous regarding when the clock started.',
          why_it_matters: 'A review window can expire if the applicant assumes business days or date of delivery.',
          suggested_question: 'What is the precise calendar cutoff date and time for submitting a review request?'
        },
        {
          dimension: 'review_path',
          title: 'Missing submission instructions',
          issue: 'No form, contact email, portal link, or address is provided.',
          why_it_matters: 'Submitting through the wrong channel may delay receipt past the deadline.',
          suggested_question: 'Is there a specific review form (e.g. Form SCH-Rev-1) and email address for this submission?'
        }
      ],
      neutral_questions: [
        'Could you please clarify which specific eligibility criterion was determined not to have been satisfied?',
        'Could you confirm which submitted application materials and records were considered during this evaluation?',
        'Which published scholarship rule or policy section governs this eligibility determination?',
        'What is the exact calendar deadline date for requesting reconsideration, and does it count from letter date or date received?',
        'Where and through what specific channel (email, online portal, or form) should a request for reconsideration be submitted?'
      ],
      action_checklist: [
        {
          id: 'act-1',
          phase: 'A. Understand the decision',
          task: 'Confirm the date the decision was received',
          category: 'understand',
          detail: 'Check email headers or postmark to document the exact timestamp this notice arrived.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'act-2',
          phase: 'A. Understand the decision',
          task: 'Identify the exact stated reason',
          category: 'understand',
          detail: 'Note that the letter gives only a blanket statement ("did not meet eligibility requirements").',
          completed: true,
          urgency: 'normal'
        },
        {
          id: 'act-3',
          phase: 'B. Gather relevant information',
          task: 'Compile original application copy & submission confirmation',
          category: 'gather',
          detail: 'Locate the PDF receipt or confirmation email showing date, attachments, and GPA submitted.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'act-4',
          phase: 'B. Gather relevant information',
          task: 'Verify official transcript metrics against general criteria',
          category: 'gather',
          detail: 'Check transcript GPA (3.82) and full-time enrollment verification (15 credit units).',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'act-5',
          phase: 'C. Clarify missing information',
          task: 'Submit a neutral clarification request for specific criterion',
          category: 'clarify',
          detail: 'Use the factual question builder to ask which specific benchmark failed.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'act-6',
          phase: 'D. Check official process',
          task: 'Locate the published Scholarship Reconsideration Policy',
          category: 'process',
          detail: 'Check the Northbridge University financial aid website for the official review form.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'act-7',
          phase: 'D. Check official process',
          task: 'Establish calendar deadline calculation',
          category: 'process',
          detail: 'Calculate 14 days from Oct 14 (Oct 28) and 14 days from email receipt to avoid missing cutoff.',
          completed: false,
          urgency: 'urgent'
        },
        {
          id: 'act-8',
          phase: 'E. Seek human support',
          task: 'Contact the student financial aid ombuds or advisor',
          category: 'support',
          detail: 'Request an informal file check with an academic awards counselor or ombudsperson.',
          completed: false,
          urgency: 'normal'
        }
      ],
      urgent_review_flags: [
        {
          category: 'Time-Sensitive Window',
          description: 'A 14-day reconsideration timeframe is indicated, with the starting calculation date left ambiguous.',
          guidance: 'Clarify the exact cutoff immediately or calculate from the earliest date (October 14) to prevent inadvertent forfeiture.'
        }
      ],
      official_sources_to_verify: [
        {
          title: 'Northbridge University Student Financial Support Handbook (Sec. 3)',
          sourceType: 'Institutional Policy',
          whyVerify: 'Verify minimum GPA and civic engagement criteria against your submitted records.'
        },
        {
          title: 'Office of Academic Awards Reconsideration Procedures',
          sourceType: 'Administrative Guide',
          whyVerify: 'Verify permissible grounds for reconsideration and accepted submission formats.'
        }
      ],
      disclaimer: 'This is general legal information and document organization. It is not legal advice or a prediction of appeal success.'
    }
  },
  {
    id: 'sample-admission',
    category: 'University Admissions',
    title: 'Graduate Admissions Rejection Notice',
    subtitle: 'University admission denial citing policy codes but omitting appeal deadlines and prerequisite course specifics',
    institution: 'St. Jude Metropolitan University',
    rawText: `ST. JUDE METROPOLITAN UNIVERSITY
OFFICE OF GRADUATE STUDIES & ADMISSIONS
Reference ID: SJM-GRAD-88340
Date of Dispatch: November 3, 2025

Dear Candidate,

Notice of Admissions Decision — Fall 2026

We write to notify you that your application for admission to the Master of Science in Data Informatics has been declined for the upcoming cohort.

Admission was not offered due to competitive program caps and prerequisite benchmarks established under Policy 4.2.1 of the Graduate Admissions Handbook. The Admissions Advisory Panel conducted an assessment of academic background in advanced quantitative subjects.

All submitted application files undergo evaluation by the departmental faculty committee.

Applicants wishing to seek an informal discussion or formal review may appeal to the Faculty Board.

We thank you for your interest in St. Jude Metropolitan University and wish you success in your future academic pursuits.

Office of Graduate Studies
St. Jude Metropolitan University`,
    mockEvidence: `Applicant Profile & Evidence Provided:
- Completed Courses: Calculus I (A), Calculus II (A-), Linear Algebra (B+), Data Structures (A)
- GRE Quantitative Score: 164 (84th percentile)
- 3 Academic references from computer science and mathematics faculty
- 2 Years professional experience as Junior Analyst`,
    mockPolicy: `St. Jude Metropolitan University Policy 4.2.1 (Graduate Admissions):
- Requirement 4.2.1(a): Minimum cumulative undergraduate GPA of 3.0 on a 4.0 scale
- Requirement 4.2.1(b): Successful completion of at least 6 credits of university-level calculus or linear algebra with a grade of B or higher
- Section 6 (Appeals): Formal appeal to the Faculty Board must be filed within 21 business days of dispatch date on Form GA-Appeal.
- Grounds for appeal: Material procedural irregularity or unconsidered academic documentation.`,
    report: {
      decision_summary: {
        decision: 'Graduate admissions application declined',
        institution: 'St. Jude Metropolitan University',
        date_received: 'November 3, 2025',
        reference_number: 'SJM-GRAD-88340',
        confidence: 97
      },
      transparency_audit: {
        decision: {
          status: 'clear',
          quote: 'your application for admission to the Master of Science in Data Informatics has been declined',
          location: 'Paragraph 2',
          explanation: 'Clear and definitive statement declining the graduate application.',
          confidence: 99
        },
        reason: {
          status: 'vague',
          quote: 'Admission was not offered due to competitive program caps and prerequisite benchmarks established under Policy 4.2.1',
          location: 'Paragraph 3',
          explanation: 'While the letter identifies two general factors (cohort capacity and prerequisite benchmarks), it does not state which specific prerequisite benchmark was considered unmet.',
          confidence: 86,
          suggested_question: 'Which specific prerequisite course or quantitative benchmark was evaluated as unsatisfied?'
        },
        evidence: {
          status: 'incomplete',
          quote: 'The Admissions Advisory Panel conducted an assessment of academic background in advanced quantitative subjects.',
          location: 'Paragraph 3',
          explanation: 'References an assessment of quantitative subjects, but does not state which undergraduate courses, credits, or test scores were credited or excluded.',
          confidence: 85,
          suggested_question: 'Could the department share the quantitative coursework evaluation summary showing which courses were credited?'
        },
        rule: {
          status: 'identified',
          quote: 'established under Policy 4.2.1 of the Graduate Admissions Handbook',
          location: 'Paragraph 3',
          explanation: 'Specifically names Policy 4.2.1 of the Graduate Admissions Handbook as the governing standard.',
          confidence: 95
        },
        deadline: {
          status: 'missing',
          date: '',
          quote: '',
          location: 'Not found in document',
          explanation: 'The letter invites applicants to appeal to the Faculty Board but completely omits any time limit, filing window, or deadline.',
          confidence: 96,
          suggested_question: 'What is the applicable deadline date for lodging a formal appeal with the Faculty Board?'
        },
        review_path: {
          status: 'incomplete',
          quote: 'Applicants wishing to seek an informal discussion or formal review may appeal to the Faculty Board.',
          location: 'Paragraph 5',
          explanation: 'Identifies the review body (Faculty Board) and options (informal discussion vs formal review), but provides no email, office contact, or filing guidelines.',
          confidence: 88,
          suggested_question: 'What is the procedure, designated contact person, and form for requesting an informal discussion or formal appeal?'
        }
      },
      clarity_score: 58,
      potential_gaps: [
        {
          dimension: 'deadline',
          title: 'Entirely omitted appeal deadline',
          issue: 'The notice authorizes an appeal to the Faculty Board without stating any deadline.',
          why_it_matters: 'Institutions typically have strict internal timelines (e.g. 14–30 days) that are unwritten in the notice.',
          suggested_question: 'What is the exact deadline to submit an appeal to the Faculty Board?'
        },
        {
          dimension: 'reason',
          title: 'Unclarified prerequisite benchmark',
          issue: 'It is unclear whether rejection was strictly due to cohort quotas or an alleged course deficiency.',
          why_it_matters: 'If the applicant completed all prerequisite courses, this may represent an administrative oversight in transcript evaluation.',
          suggested_question: 'Was the decline based solely on cohort capacity constraints, or was an individual prerequisite course found lacking?'
        },
        {
          dimension: 'review_path',
          title: 'Undefined review process and grounds',
          issue: 'No instructions on what materials or evidence the Faculty Board accepts.',
          why_it_matters: 'Appeals submitted without addressing permissible institutional grounds are frequently rejected on procedural grounds.',
          suggested_question: 'What grounds of appeal are recognized by the Faculty Board under Policy 4.2.1?'
        }
      ],
      neutral_questions: [
        'Could you clarify whether the application was declined based on cohort capacity constraints or a specific prerequisite course benchmark?',
        'If a prerequisite benchmark was not satisfied, which specific subject or credit requirement was evaluated as deficient?',
        'What is the deadline date and submission protocol for appealing to the Faculty Board under Policy 4.2.1?',
        'Who is the contact person or office designated to conduct the informal discussion mentioned in the letter?'
      ],
      action_checklist: [
        {
          id: 'adm-1',
          phase: 'A. Understand the decision',
          task: 'Document dispatch date and estimated arrival date',
          category: 'understand',
          detail: 'Notice lists dispatch date as November 3, 2025. Archive original email or delivery stamp.',
          completed: true,
          urgency: 'normal'
        },
        {
          id: 'adm-2',
          phase: 'B. Gather relevant information',
          task: 'Extract syllabus descriptions for all quantitative coursework',
          category: 'gather',
          detail: 'Gather official course descriptions for Calculus I, Calculus II, and Linear Algebra to substantiate quantitative prerequisite completion.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'adm-3',
          phase: 'B. Gather relevant information',
          task: 'Retrieve official Policy 4.2.1 from the Graduate Admissions Handbook',
          category: 'gather',
          detail: 'Download the current handbook to compare Section 4.2.1 against your academic transcript.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'adm-4',
          phase: 'C. Clarify missing information',
          task: 'Request an informal discussion with the graduate program advisor',
          category: 'clarify',
          detail: 'Send a neutral inquiry asking for the quantitative coursework evaluation summary.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'adm-5',
          phase: 'D. Check official process',
          task: 'Confirm the Faculty Board appeal window immediately',
          category: 'process',
          detail: 'Because no deadline is printed in the letter, contact the Office of Graduate Studies promptly to ensure no hidden 14-day or 21-day window passes.',
          completed: false,
          urgency: 'urgent'
        },
        {
          id: 'adm-6',
          phase: 'E. Seek human support',
          task: 'Consult the university student advocate or department liaison',
          category: 'support',
          detail: 'Seek guidance from an independent university ombudsman regarding procedural review rights.',
          completed: false,
          urgency: 'normal'
        }
      ],
      urgent_review_flags: [
        {
          category: 'Unstated Appeal Deadline',
          description: 'An appeal is explicitly offered, but no deadline is printed in the notice.',
          guidance: 'Institutional policies typically enforce deadlines ranging between 10 to 30 days from dispatch. Contact the office immediately to avoid missing the window.'
        }
      ],
      official_sources_to_verify: [
        {
          title: 'St. Jude Metropolitan University Graduate Admissions Handbook (Policy 4.2.1)',
          sourceType: 'Institutional Policy',
          whyVerify: 'Verify quantitative prerequisite benchmarks and departmental capacity quota definitions.'
        },
        {
          title: 'Faculty Board Graduate Appeals Bylaws (Section 6)',
          sourceType: 'Academic Governance Code',
          whyVerify: 'Confirm filing deadlines, required documentation, and procedural review grounds.'
        }
      ],
      disclaimer: 'This is general legal information and document organization. It is not legal advice or a prediction of appeal success.'
    }
  },
  {
    id: 'sample-benefits',
    category: 'Government Benefits',
    title: 'Regional Housing Assistance Benefit Notice',
    subtitle: 'Public benefits determination with unitemized expenditure proof and vague thirty-day timeline',
    institution: 'Regional Department of Social & Health Services',
    rawText: `REGIONAL DEPARTMENT OF SOCIAL & HEALTH SERVICES
BENEFIT ADJUDICATION DIVISION
Case ID: DSHS-HB-55209-X
Notification Date: December 1, 2025

Dear Resident,

Notice of Action: Housing & Energy Assistance Supplement (HEA)

This letter serves as formal administrative notice that your application for the 2025–2026 Supplementary Housing Allowance has been DENIED.

Reason for Denial: Our review determined insufficient verification of eligible household expenditure under Administrative Directive 12-B.

Your documented monthly gross income was recorded as $2,410.00.

You have the right to request an Administrative Hearing if you disagree with this action. An appeal must be filed within thirty days.

To request a hearing, contact your assigned caseworker or submit a written statement requesting review.

Department Hearings Coordinator
Regional Department of Social & Health Services`,
    mockEvidence: `Documented Resident Records:
- Lease Agreement dated June 1, 2025 ($1,450 / month rent)
- Heating and electricity utility bills for Sept, Oct, Nov 2025
- Pay stubs for last 60 days averaging $2,410 gross monthly
- Written receipt of document submission signed by caseworker on Nov 18, 2025`,
    mockPolicy: `Administrative Directive 12-B (Housing Supplement Eligibility):
- Gross household income limit for family of 2: $2,750.00 / month
- Eligible housing expenditure must exceed 35% of gross monthly income ($843.50)
- Acceptable verification includes: signed residential lease, utility bills, or cancelled checks
- An administrative hearing must be requested within 30 calendar days of notification postmark on Form AD-HRG-100`,
    report: {
      decision_summary: {
        decision: 'Supplementary housing allowance denied',
        institution: 'Regional Department of Social & Health Services',
        date_received: 'December 1, 2025',
        reference_number: 'DSHS-HB-55209-X',
        confidence: 98
      },
      transparency_audit: {
        decision: {
          status: 'clear',
          quote: 'your application for the 2025–2026 Supplementary Housing Allowance has been DENIED.',
          location: 'Paragraph 2',
          explanation: 'Clear and unambiguous formal denial of the housing supplement.',
          confidence: 99
        },
        reason: {
          status: 'vague',
          quote: 'Our review determined insufficient verification of eligible household expenditure under Administrative Directive 12-B.',
          location: 'Paragraph 3',
          explanation: 'The letter does not itemize which expenditure items (rent lease, heat, electric, or water) were deemed unverified or rejected.',
          confidence: 89,
          suggested_question: 'Which specific household expenditure document was deemed missing or insufficiently verified?'
        },
        evidence: {
          status: 'incomplete',
          quote: 'Your documented monthly gross income was recorded as $2,410.00.',
          location: 'Paragraph 4',
          explanation: 'States gross income, but provides no calculation or summary of what shelter expenses were recognized or excluded.',
          confidence: 90,
          suggested_question: 'What total housing expenditure figure was calculated from the submitted verification documents?'
        },
        rule: {
          status: 'identified',
          quote: 'under Administrative Directive 12-B.',
          location: 'Paragraph 3',
          explanation: 'Cites Administrative Directive 12-B as the legal authority.',
          confidence: 94
        },
        deadline: {
          status: 'ambiguous',
          date: 'Within thirty days',
          quote: 'An appeal must be filed within thirty days.',
          location: 'Paragraph 5',
          explanation: 'Fails to specify whether "thirty days" runs from the notification date (Dec 1), the mailing date, or date of delivery, and whether calendar or working days apply.',
          confidence: 91,
          suggested_question: 'Is the 30-day appeal deadline calculated from December 1 or date of receipt, and does it count calendar or business days?'
        },
        review_path: {
          status: 'incomplete',
          quote: 'contact your assigned caseworker or submit a written statement requesting review.',
          location: 'Paragraph 6',
          explanation: 'Mentions contacting the assigned caseworker or submitting a statement, but provides no caseworker name, phone number, physical mailing address, or hearing portal.',
          confidence: 87,
          suggested_question: 'To which physical address or digital submission portal should the written request for an administrative hearing be delivered?'
        }
      },
      clarity_score: 62,
      potential_gaps: [
        {
          dimension: 'reason',
          title: 'Unitemized expenditure verification failure',
          issue: 'The notice does not state whether the lease was missing, utility bills unaccepted, or calculation flawed.',
          why_it_matters: 'You cannot cure the specific documentation gap without knowing which bill or receipt was rejected.',
          suggested_question: 'Can the department provide an itemized list of submitted expenditure documents that were accepted vs rejected?'
        },
        {
          dimension: 'deadline',
          title: 'Ambiguous 30-day calculation rule',
          issue: 'No reference to postmark vs receipt or calendar vs business days.',
          why_it_matters: 'Missing a government hearing deadline can permanently forfeit benefits.',
          suggested_question: 'What is the precise cutoff date on the calendar for this administrative hearing request?'
        },
        {
          dimension: 'review_path',
          title: 'Unidentified caseworker & submission address',
          issue: 'Directs the applicant to their "assigned caseworker" without providing a name or contact information.',
          why_it_matters: 'Sending appeals to general agency mailboxes often leads to processing delays.',
          suggested_question: 'What is the caseworker\'s direct contact number and the official hearing filing address?'
        }
      ],
      neutral_questions: [
        'Which specific housing or utility expenditure documents were found to be insufficiently verified under Administrative Directive 12-B?',
        'What was the total monthly shelter and energy expenditure amount calculated by the adjudicator?',
        'Does the 30-day appeal period calculate from the letter date (December 1) or the date received, and what is the exact deadline date?',
        'What is the name, email address, or office address of the assigned caseworker or hearings unit for filing the review request?'
      ],
      action_checklist: [
        {
          id: 'ben-1',
          phase: 'A. Understand the decision',
          task: 'Document envelope postmark date and delivery date',
          category: 'understand',
          detail: 'Keep the original mailing envelope with postmark to prove delivery date in case of timeliness disputes.',
          completed: true,
          urgency: 'normal'
        },
        {
          id: 'ben-2',
          phase: 'B. Gather relevant information',
          task: 'Assemble complete housing cost portfolio',
          category: 'gather',
          detail: 'Collect current signed lease, rent payment receipts, electric and heating utility bills from the past 90 days.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'ben-3',
          phase: 'C. Clarify missing information',
          task: 'Request adjudicator expenditure calculation sheet',
          category: 'clarify',
          detail: 'Submit a neutral clarification request asking for the itemized expenditure breakdown.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'ben-4',
          phase: 'D. Check official process',
          task: 'Calculate the earliest 30-day appeal deadline',
          category: 'process',
          detail: 'Calculate 30 calendar days from December 1 (December 31, 2025) as the safest operational target.',
          completed: false,
          urgency: 'urgent'
        },
        {
          id: 'ben-5',
          phase: 'D. Check official process',
          task: 'Locate official Form AD-HRG-100 for administrative hearing',
          category: 'process',
          detail: 'Verify the required state agency hearing request form.',
          completed: false,
          urgency: 'normal'
        },
        {
          id: 'ben-6',
          phase: 'E. Seek human support',
          task: 'Contact local legal aid or public benefits advocacy clinic',
          category: 'support',
          detail: 'Because basic housing assistance is at stake, consider contacting a qualified legal aid organization for guidance on administrative hearing representation.',
          completed: false,
          urgency: 'urgent'
        }
      ],
      urgent_review_flags: [
        {
          category: 'Essential Benefit Impact',
          description: 'This matter involves essential housing and energy assistance, which may impact living stability.',
          guidance: 'For decisions affecting shelter or essential support, seek immediate advice from a qualified legal aid service or housing advocacy organization.'
        },
        {
          category: 'Strict 30-Day Window',
          description: 'A 30-day administrative hearing window is subject to strict statutory forfeiture in public benefits programs.',
          guidance: 'File the written hearing request well before the 30-day mark from December 1 to avoid loss of hearing rights.'
        }
      ],
      official_sources_to_verify: [
        {
          title: 'Administrative Directive 12-B (Housing Supplement Eligibility)',
          sourceType: 'Administrative Rule',
          whyVerify: 'Verify income eligibility limits and accepted documentation standards for housing expense deductions.'
        },
        {
          title: 'Department of Social & Health Services Fair Hearing Manual',
          sourceType: 'Procedural Manual',
          whyVerify: 'Verify rules for continuing benefits pending appeal and formal hearing submission guidelines.'
        }
      ],
      disclaimer: 'This is general legal information and document organization. It is not legal advice or a prediction of appeal success.'
    }
  }
];
