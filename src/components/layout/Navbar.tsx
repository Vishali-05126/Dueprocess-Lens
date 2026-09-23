import React, { useState } from 'react';
import { 
  Scale, ShieldCheck, Sparkles, FileText, CheckSquare, GitCompare, 
  FolderHeart, BookOpen, Bot, LogIn, LogOut, User as UserIcon, Database 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  hasActiveReport: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, hasActiveReport }) => {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E294B] bg-[#0B1020]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6857FF] to-[#48D9E8] flex items-center justify-center shadow-lg shadow-[#6857FF]/20 group-hover:scale-105 transition-transform">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-serif font-medium tracking-tight text-[#F7F4ED] group-hover:text-[#48D9E8] transition-colors">
            DueProcess Lens
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectTab('workspace')}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-md ${
              currentTab === 'workspace'
                ? 'text-[#48D9E8] bg-[#111936]'
                : 'text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936]/50'
            }`}
          >
            Workspace
          </button>
          
          <button
            onClick={() => onSelectTab('report')}
            disabled={!hasActiveReport}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-md flex items-center gap-1.5 ${
              !hasActiveReport
                ? 'text-[#8E98B7]/40 cursor-not-allowed'
                : currentTab === 'report'
                ? 'text-[#48D9E8] bg-[#111936]'
                : 'text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936]/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transparency Report</span>
          </button>

          <button
            onClick={() => onSelectTab('action')}
            disabled={!hasActiveReport}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-md flex items-center gap-1.5 ${
              !hasActiveReport
                ? 'text-[#8E98B7]/40 cursor-not-allowed'
                : currentTab === 'action'
                ? 'text-[#48D9E8] bg-[#111936]'
                : 'text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936]/50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Action Plan</span>
          </button>

          <button
            onClick={() => onSelectTab('comparison')}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-md flex items-center gap-1.5 ${
              currentTab === 'comparison'
                ? 'text-[#48D9E8] bg-[#111936]'
                : 'text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936]/50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Alignment</span>
          </button>

          <button
            onClick={() => onSelectTab('chat')}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-md flex items-center gap-1.5 ${
              currentTab === 'chat'
                ? 'text-[#48D9E8] bg-[#111936]'
                : 'text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936]/50'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#48D9E8]" />
            <span>AI Advisor</span>
          </button>

          <button
            onClick={() => onSelectTab('case')}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-md flex items-center gap-1.5 ${
              currentTab === 'case'
                ? 'text-[#48D9E8] bg-[#111936]'
                : 'text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936]/50'
            }`}
          >
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Case File</span>
          </button>

          <button
            onClick={() => onSelectTab('demo')}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-md ${
              currentTab === 'demo'
                ? 'text-[#48D9E8] bg-[#111936]'
                : 'text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936]/50'
            }`}
          >
            Demo
          </button>

          <button
            onClick={() => onSelectTab('methodology')}
            className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors rounded-md ${
              currentTab === 'methodology'
                ? 'text-[#48D9E8] bg-[#111936]'
                : 'text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936]/50'
            }`}
          >
            Methodology
          </button>
        </nav>

        {/* Zone 3: Actions & Google Sign-In */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] text-xs transition-colors"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User avatar" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#6857FF] flex items-center justify-center text-white text-[10px] font-bold">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline text-xs text-[#F7F4ED] max-w-[100px] truncate">
                  {user.displayName || 'Advocate'}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#2ECC9A]" title="Firestore Connected" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0F162E] border border-[#1E294B] p-2 space-y-1 shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-[#1E294B]">
                    <div className="text-xs font-semibold text-[#F7F4ED] truncate">{user.displayName}</div>
                    <div className="text-[10px] text-[#8E98B7] truncate">{user.email}</div>
                    <div className="flex items-center gap-1 text-[10px] text-[#2ECC9A] mt-1">
                      <Database className="w-2.5 h-2.5" />
                      <span>Firestore Sync Active</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSelectTab('case');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FolderHeart className="w-3.5 h-3.5" />
                    <span>My Saved Cases</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSelectTab('chat');
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#8E98B7] hover:text-[#F7F4ED] hover:bg-[#111936] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#48D9E8]" />
                    <span>AI Advisor Chat</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOutUser();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#FF8585] hover:bg-[#FF6B6B]/15 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="px-3 py-1.5 text-xs font-medium text-[#F7F4ED] bg-[#111936] hover:bg-[#18234D] border border-[#1E294B] rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Sign In</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('workspace')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#6857FF] to-[#5143E0] hover:from-[#7869FF] hover:to-[#6052F0] rounded-lg shadow-sm shadow-[#6857FF]/30 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#48D9E8]" />
            <span className="hidden sm:inline">Audit Notice</span>
          </button>
        </div>
      </div>
    </header>
  );
};
