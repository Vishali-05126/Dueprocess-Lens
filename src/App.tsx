import React, { useState, useEffect } from 'react';
import { SAMPLE_NOTICES } from './data/sampleNotices';
import { TransparencyReportData, CaseFile, ActionChecklistItem } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { UploadWorkspace } from './components/workspace/UploadWorkspace';
import { TransparencyReport } from './components/report/TransparencyReport';
import { ActionPlanPage } from './components/action/ActionPlanPage';
import { DocumentComparisonPage } from './components/comparison/DocumentComparisonPage';
import { CaseFilePage } from './components/case/CaseFilePage';
import { ProductDemoPage } from './components/demo/ProductDemoPage';
import { MethodologyPage } from './components/methodology/MethodologyPage';
import { ChatAdvisorPage } from './components/chat/ChatAdvisorPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveCaseToFirestore, deleteCaseFromFirestore, loadUserCases } from './firebase/caseService';

function AppContent() {
  const { user } = useAuth();
  const defaultSample = SAMPLE_NOTICES[0];

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeReport, setActiveReport] = useState<TransparencyReportData | null>(defaultSample.report);
  const [rawNoticeText, setRawNoticeText] = useState<string>(defaultSample.rawText);
  const [savedCases, setSavedCases] = useState<CaseFile[]>([]);

  // Active Case File
  const [currentCase, setCurrentCase] = useState<CaseFile>({
    id: 'case-demo-1',
    title: 'Northbridge Graduate Merit Fellowship Notice',
    category: 'Scholarship',
    institution: 'Northbridge University Committee on Academic Awards',
    referenceNumber: 'SCH-2025-9921',
    dateReceived: 'October 14, 2025',
    status: 'Analyzed',
    keyDeadline: '14 calendar days from notice (approx. Oct 28, 2025)',
    notes: 'Requested clarification regarding transcript receipt on Oct 16. Spoke with Graduate Awards Coordinator.',
    report: defaultSample.report,
    activityTimeline: [
      {
        id: 'tl-1',
        timestamp: '10:15 AM',
        action: 'Notice uploaded',
        detail: 'Rejection letter text uploaded and client-side redacted.'
      },
      {
        id: 'tl-2',
        timestamp: '10:16 AM',
        action: 'Transparency audit executed',
        detail: 'Communication clarity scored at 54/100. Stated reasons identified as vague.'
      },
      {
        id: 'tl-3',
        timestamp: '10:20 AM',
        action: 'Clarification inquiry generated',
        detail: 'Factual questions drafted for the Committee on Academic Awards.'
      }
    ]
  });

  // Load cases from Firestore whenever the user authenticates
  useEffect(() => {
    if (user) {
      loadUserCases(user.uid)
        .then((cases) => {
          if (cases && cases.length > 0) {
            setSavedCases(cases);
            // Optionally select the most recent one
            setCurrentCase(cases[0]);
            if (cases[0].report) {
              setActiveReport(cases[0].report);
            }
            if (cases[0].rawNotice) {
              setRawNoticeText(cases[0].rawNotice);
            }
          } else {
            // First time sign-in: persist current initial case to Firestore
            saveCaseToFirestore(user.uid, currentCase).catch(console.warn);
            setSavedCases([currentCase]);
          }
        })
        .catch(err => console.warn('Could not load user cases:', err));
    }
  }, [user]);

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCase = (updated: CaseFile) => {
    setCurrentCase(updated);
    if (user) {
      saveCaseToFirestore(user.uid, updated).catch(console.warn);
      setSavedCases(prev => {
        const idx = prev.findIndex(c => c.id === updated.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        }
        return [updated, ...prev];
      });
    }
  };

  const handleAnalysisComplete = (report: TransparencyReportData, rawNotice: string) => {
    setActiveReport(report);
    setRawNoticeText(rawNotice);

    // Update or create case
    const newCase: CaseFile = {
      id: `case-${Date.now()}`,
      title: `${report.decision_summary.institution || 'Institutional'} Decision Notice`,
      category: report.category || 'General Rejection',
      institution: report.decision_summary.institution || 'Evaluating Institution',
      referenceNumber: report.decision_summary.reference_number || 'N/A',
      dateReceived: report.decision_summary.date_received || 'Recently',
      status: 'Analyzed',
      keyDeadline: report.transparency_audit.deadline.date || 'Review immediately',
      notes: '',
      rawNotice,
      report,
      activityTimeline: [
        {
          id: `tl-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Notice uploaded & analyzed',
          detail: `Transparency audit executed. Clarity score: ${report.clarity_score}/100.`
        }
      ]
    };

    setCurrentCase(newCase);
    if (user) {
      saveCaseToFirestore(user.uid, newCase).catch(console.warn);
      setSavedCases(prev => [newCase, ...prev]);
    }

    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadDemoReport = (report: TransparencyReportData, sampleId: string) => {
    setActiveReport(report);
    const s = SAMPLE_NOTICES.find(item => item.id === sampleId) || defaultSample;
    setRawNoticeText(s.rawText);

    const importedCase: CaseFile = {
      id: `case-${s.id}`,
      title: s.title,
      category: s.category,
      institution: s.institution,
      referenceNumber: report.decision_summary.reference_number,
      dateReceived: report.decision_summary.date_received,
      status: 'Analyzed',
      keyDeadline: report.transparency_audit.deadline.date || '14-30 days',
      notes: 'Sample case loaded from interactive library.',
      rawNotice: s.rawText,
      report,
      activityTimeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: 'Just now',
          action: 'Sample case imported',
          detail: `Imported ${s.title} for review.`
        }
      ]
    };

    setCurrentCase(importedCase);
    if (user) {
      saveCaseToFirestore(user.uid, importedCase).catch(console.warn);
      setSavedCases(prev => [importedCase, ...prev.filter(c => c.id !== importedCase.id)]);
    }
  };

  const handleUpdateChecklist = (items: ActionChecklistItem[]) => {
    if (activeReport) {
      const updatedReport = { ...activeReport, action_checklist: items };
      setActiveReport(updatedReport);
      const updatedCase: CaseFile = {
        ...currentCase,
        report: updatedReport,
        activityTimeline: [
          ...currentCase.activityTimeline,
          {
            id: `act-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: 'Checklist updated',
            detail: 'User modified preparation task items.'
          }
        ]
      };
      setCurrentCase(updatedCase);
      if (user) {
        saveCaseToFirestore(user.uid, updatedCase).catch(console.warn);
      }
    }
  };

  const handleDeleteCase = () => {
    if (user && currentCase.id) {
      deleteCaseFromFirestore(user.uid, currentCase.id).catch(console.warn);
      setSavedCases(prev => prev.filter(c => c.id !== currentCase.id));
    }

    // Reset to clean state
    setCurrentCase({
      id: `case-new-${Date.now()}`,
      title: 'Untitled Case File',
      category: 'Unassigned',
      institution: 'Not set',
      referenceNumber: 'None',
      dateReceived: 'Today',
      status: 'Draft',
      keyDeadline: 'Not determined',
      notes: '',
      activityTimeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: 'Just now',
          action: 'New case created',
          detail: 'Previous case file deleted.'
        }
      ]
    });
    setActiveReport(null);
    setCurrentTab('workspace');
  };

  return (
    <div className="min-h-screen bg-[#070B18] text-[#F7F4ED] flex flex-col font-sans selection:bg-[#6857FF]/30 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        hasActiveReport={!!activeReport}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'landing' && (
          <LandingPage
            onStartAudit={() => handleSelectTab('workspace')}
            onExploreDemo={() => handleSelectTab('demo')}
          />
        )}

        {currentTab === 'workspace' && (
          <UploadWorkspace
            onAnalysisComplete={handleAnalysisComplete}
            onExploreDemo={() => handleSelectTab('demo')}
          />
        )}

        {currentTab === 'report' && activeReport && (
          <TransparencyReport
            report={activeReport}
            rawNotice={rawNoticeText}
            onNavigateToAction={() => handleSelectTab('action')}
            onNavigateToComparison={() => handleSelectTab('comparison')}
          />
        )}

        {currentTab === 'action' && activeReport && (
          <ActionPlanPage
            report={activeReport}
            onUpdateChecklist={handleUpdateChecklist}
            onNavigateToCase={() => handleSelectTab('case')}
          />
        )}

        {currentTab === 'comparison' && (
          <DocumentComparisonPage
            initialNoticeText={rawNoticeText}
          />
        )}

        {currentTab === 'chat' && (
          <ChatAdvisorPage
            activeNoticeText={rawNoticeText}
            activeCaseTitle={currentCase.title}
          />
        )}

        {currentTab === 'case' && (
          <CaseFilePage
            currentCase={currentCase}
            savedCases={savedCases}
            onSelectSavedCase={(c) => {
              setCurrentCase(c);
              if (c.report) setActiveReport(c.report);
              if (c.rawNotice) setRawNoticeText(c.rawNotice);
            }}
            onUpdateCase={handleUpdateCase}
            onDeleteCase={handleDeleteCase}
            onNavigateToReport={() => handleSelectTab('report')}
            onNavigateToChat={() => handleSelectTab('chat')}
          />
        )}

        {currentTab === 'demo' && (
          <ProductDemoPage
            onLoadReport={handleLoadDemoReport}
            onNavigateToReport={() => handleSelectTab('report')}
            onNavigateToAction={() => handleSelectTab('action')}
          />
        )}

        {currentTab === 'methodology' && (
          <MethodologyPage />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
