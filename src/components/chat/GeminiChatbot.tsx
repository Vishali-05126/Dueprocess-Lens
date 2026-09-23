import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, User as UserIcon, Send, Sparkles, Zap, ShieldAlert, 
  HelpCircle, RefreshCw, MessageSquare, History, FileText, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatbotProps {
  contextNotice?: string;
  caseTitle?: string;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ contextNotice, caseTitle }) => {
  const { user } = useAuth();

  // Role / Model state
  // complex: gemini-3.1-pro-preview
  // general: gemini-3.5-flash
  // fast: gemini-3.1-flash-lite
  const [taskType, setTaskType] = useState<'general' | 'complex' | 'fast'>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      content: `Hello! I am your DueProcess Lens Civic AI Advisor. 

I can help examine vague rejection statements, clarify ambiguous appeal deadlines, identify unmentioned documents, or draft respectful inquiry letters for institutional reviews. 

How can I assist with your decision notice today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash'
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [customSystemInstruction, setCustomSystemInstruction] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          taskType,
          contextNotice: contextNotice || '',
          customSystemInstruction: customSystemInstruction || ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: data.reply || 'No response generated.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed
        };
        const finalMessages = [...newMessages, modelMsg];
        setMessages(finalMessages);

        // Save conversation thread to Firestore if user is authenticated
        if (user) {
          try {
            const sessionDoc = doc(db, 'users', user.uid, 'chatSessions', 'default-session');
            await setDoc(sessionDoc, {
              id: 'default-session',
              userId: user.uid,
              role: taskType,
              model: data.modelUsed || 'gemini',
              messages: finalMessages,
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.warn('[Firestore] note saving chat session:', e);
          }
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch response');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `I encountered an issue processing your request: ${err?.message || 'Server timeout'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleBadge = (type: typeof taskType) => {
    switch (type) {
      case 'complex':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#6857FF]/20 text-[#A297FF] border border-[#6857FF]/40 text-[11px] font-mono">
            <Sparkles className="w-3 h-3 text-[#A297FF]" />
            <span>Complex Policy Analyst (gemini-3.1-pro-preview)</span>
          </span>
        );
      case 'fast':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2ECC9A]/15 text-[#2ECC9A] border border-[#2ECC9A]/30 text-[11px] font-mono">
            <Zap className="w-3 h-3 text-[#2ECC9A]" />
            <span>Rapid Drafter (gemini-3.1-flash-lite)</span>
          </span>
        );
      case 'general':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#48D9E8]/15 text-[#48D9E8] border border-[#48D9E8]/30 text-[11px] font-mono">
            <Bot className="w-3 h-3 text-[#48D9E8]" />
            <span>General Advisor (gemini-3.5-flash)</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-[#0F162E] border border-[#1E294B] flex flex-col h-[700px] overflow-hidden shadow-2xl">
      {/* Top Bar */}
      <div className="p-4 border-b border-[#1E294B] bg-[#070B18]/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6857FF]/20 border border-[#6857FF]/30 flex items-center justify-center text-[#48D9E8]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#F7F4ED]">DueProcess Multi-Turn Advisor</h3>
              {getRoleBadge(taskType)}
            </div>
            <p className="text-[11px] text-[#8E98B7]">
              {caseTitle ? `Active Context: ${caseTitle}` : 'Administrative Transparency & Procedural Clarification'}
            </p>
          </div>
        </div>

        {/* Role & Model Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value as any)}
            className="text-xs bg-[#111936] border border-[#1E294B] rounded-lg px-2.5 py-1.5 text-[#F7F4ED] focus:outline-none focus:border-[#48D9E8]"
          >
            <option value="general">General Tasks (gemini-3.5-flash)</option>
            <option value="complex">Complex Tasks (gemini-3.1-pro-preview)</option>
            <option value="fast">Fast Tasks (gemini-3.1-flash-lite)</option>
          </select>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-[#1E294B] bg-[#111936] text-[#8E98B7] hover:text-[#F7F4ED] transition-colors"
            title="Configure System Instruction"
          >
            Config
          </button>
        </div>
      </div>

      {/* Optional System Instruction Config drawer */}
      {showConfig && (
        <div className="p-3 bg-[#0B1020] border-b border-[#1E294B] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#F7F4ED]">Custom System Instruction</span>
            <span className="text-[10px] text-[#8E98B7]">Appended to model prompt</span>
          </div>
          <input
            type="text"
            value={customSystemInstruction}
            onChange={(e) => setCustomSystemInstruction(e.target.value)}
            placeholder="e.g. Focus on financial aid regulations or adopt a very concise formal tone..."
            className="w-full text-xs font-mono bg-[#070B18] border border-[#1E294B] rounded-lg p-2 text-[#F7F4ED] focus:outline-none focus:border-[#48D9E8]"
          />
        </div>
      )}

      {/* Scrollable Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isModel = m.role === 'model';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <div className="w-7 h-7 rounded-full bg-[#111936] border border-[#1E294B] flex items-center justify-center text-[#48D9E8] shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 shadow-md ${
                  isModel
                    ? 'bg-[#111936] border border-[#1E294B] text-[#F7F4ED]'
                    : 'bg-gradient-to-r from-[#6857FF] to-[#5143E0] text-white border border-[#6857FF]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-70 mb-1">
                  <span className="font-mono">{isModel ? 'DueProcess AI' : (user?.displayName || 'You')}</span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans space-y-1">
                  {m.content}
                </div>

                {isModel && m.modelUsed && (
                  <div className="pt-2 mt-2 border-t border-[#1E294B]/60 flex items-center justify-between text-[10px] text-[#8E98B7]">
                    <span className="font-mono">Engine: {m.modelUsed}</span>
                    <span className="text-[#2ECC9A] flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                    </span>
                  </div>
                )}
              </div>

              {!isModel && (
                <div className="w-7 h-7 rounded-full bg-[#6857FF] border border-[#6857FF]/40 flex items-center justify-center text-white shrink-0 mt-0.5 font-bold text-[10px]">
                  {user?.displayName ? user.displayName.charAt(0) : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#111936] border border-[#1E294B] flex items-center justify-center text-[#48D9E8] shrink-0 animate-pulse">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#111936] border border-[#1E294B] text-xs text-[#8E98B7] flex items-center gap-2">
              <RefreshCw className="w-3 h-3 animate-spin text-[#48D9E8]" />
              <span>Analyzing with {taskType === 'complex' ? 'gemini-3.1-pro-preview' : taskType === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'}...</span>
            </div>
          </div>
        )}

        <div ref={threadEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-[#070B18]/60 border-t border-[#1E294B] flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
        <span className="text-[#8E98B7] whitespace-nowrap">Suggested:</span>
        <button
          onClick={() => handleSendMessage('What questions should I ask to clarify why my application was rejected?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] text-[#F7F4ED] transition-colors"
        >
          Clarify vague reason
        </button>
        <button
          onClick={() => handleSendMessage('How should I interpret "within 14 days of this notice" regarding the deadline?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] text-[#F7F4ED] transition-colors"
        >
          Analyze deadline ambiguity
        </button>
        <button
          onClick={() => handleSendMessage('Can you draft a polite, fact-based email requesting an informal review?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] text-[#F7F4ED] transition-colors"
        >
          Draft informal inquiry
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#070B18] border-t border-[#1E294B]">
        <div className="flex items-end gap-2 bg-[#0F162E] border border-[#1E294B] rounded-xl p-2 focus-within:border-[#48D9E8] transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={`Ask a question about your notice... (Shift+Enter for new line)`}
            className="flex-1 bg-transparent border-none text-xs text-[#F7F4ED] focus:outline-none resize-none font-sans leading-relaxed"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isSending}
            className="p-2.5 rounded-lg bg-[#6857FF] hover:bg-[#7869FF] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
