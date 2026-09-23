import React from 'react';
import { GeminiChatbot } from './GeminiChatbot';
import { SafetyBanner } from '../common/SafetyBanner';
import { Bot, Sparkles, Zap, ShieldCheck, Database, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ChatAdvisorPageProps {
  activeNoticeText?: string;
  activeCaseTitle?: string;
}

export const ChatAdvisorPage: React.FC<ChatAdvisorPageProps> = ({ activeNoticeText, activeCaseTitle }) => {
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SafetyBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E294B] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#111936] text-[11px] text-[#48D9E8] font-medium border border-[#1E294B] mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Interactive Gemini Civic Advisor</span>
          </div>
          <h1 className="text-3xl font-serif text-[#F7F4ED]">
            Multi-Turn Due Process Advisor
          </h1>
          <p className="text-xs sm:text-sm text-[#8E98B7] mt-1 max-w-2xl leading-relaxed">
            Consult with our specialized Gemini AI models for multi-turn conversational analysis. Select between General Advisor, Complex Policy Strategist, and Rapid Drafter roles.
          </p>
        </div>

        {/* Auth / Firestore sync status */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2ECC9A]/10 border border-[#2ECC9A]/30 text-xs text-[#2ECC9A]">
              <Database className="w-3.5 h-3.5" />
              <span>Synced with Firestore</span>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#6857FF]/20 hover:bg-[#6857FF]/30 border border-[#6857FF]/40 text-xs text-[#F7F4ED] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#48D9E8]" />
              <span>Sign In to Save History</span>
            </button>
          )}
        </div>
      </div>

      {/* Role description cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#48D9E8]">
            <Bot className="w-4 h-4" />
            <span>General Tasks</span>
          </div>
          <span className="text-[10px] font-mono text-[#8E98B7] block">Model: gemini-3.5-flash</span>
          <p className="text-[11px] text-[#8E98B7] leading-relaxed">
            Explaining procedural terminology, identifying missing reasons, and providing step-by-step guidance.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A297FF]">
            <Sparkles className="w-4 h-4" />
            <span>Complex Tasks</span>
          </div>
          <span className="text-[10px] font-mono text-[#8E98B7] block">Model: gemini-3.1-pro-preview</span>
          <p className="text-[11px] text-[#8E98B7] leading-relaxed">
            Multi-tiered institutional regulations, identifying hidden policy contradictions, and formal appeal escalation.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0F162E] border border-[#1E294B] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2ECC9A]">
            <Zap className="w-4 h-4" />
            <span>Fast Tasks</span>
          </div>
          <span className="text-[10px] font-mono text-[#8E98B7] block">Model: gemini-3.1-flash-lite</span>
          <p className="text-[11px] text-[#8E98B7] leading-relaxed">
            Instantaneous formulation of concise questions, phone scripts, and rapid email follow-ups.
          </p>
        </div>
      </div>

      {/* Chatbot Interface */}
      <GeminiChatbot
        contextNotice={activeNoticeText}
        caseTitle={activeCaseTitle}
      />
    </div>
  );
};
