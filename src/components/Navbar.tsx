import React, { useState } from 'react';
import { Shield, Trophy, RotateCcw, Info, Sparkles, Users } from './icons';

interface NavbarProps {
  currentTab: 'draft' | 'dreamteam' | 'tournament';
  onSelectTab: (tab: 'draft' | 'dreamteam' | 'tournament') => void;
  rerollsLeft: number;
  picksCount: number;
  hasCoach: boolean;
  onResetGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  rerollsLeft,
  picksCount,
  hasCoach,
  onResetGame,
}) => {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0D1923]/95 backdrop-blur-md border-b border-[#354653]/60 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A45C] to-[#80683D] flex items-center justify-center shadow-lg shadow-[#C9A45C]/20 border border-[#F2F0E9]/20">
              <Shield className="w-6 h-6 text-[#071018]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Barlow_Condensed'] font-black text-2xl lg:text-3xl tracking-wider text-[#F2F0E9]">
                  AOV<span className="text-[#C9A45C]">DLE</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40">
                  APL 2026
                </span>
              </div>
              <p className="text-[11px] text-[#91A0AA] hidden sm:block tracking-wide">
                Build your Dream Team • Choose Coach • Rewrite History
              </p>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="flex items-center bg-[#071018] rounded-xl p-1 border border-[#354653]/50">
            <button
              onClick={() => onSelectTab('draft')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'draft'
                  ? 'bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-bold shadow-md'
                  : 'text-[#91A0AA] hover:text-[#F2F0E9]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>DRAFT</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                currentTab === 'draft' ? 'bg-[#071018]/30 text-[#071018]' : 'bg-[#142330] text-[#C9A45C]'
              }`}>
                {picksCount}/5{hasCoach ? '+HLV' : ''}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('dreamteam')}
              disabled={picksCount < 5}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'dreamteam'
                  ? 'bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-bold shadow-md'
                  : picksCount < 5
                  ? 'text-[#91A0AA]/40 cursor-not-allowed'
                  : 'text-[#91A0AA] hover:text-[#F2F0E9]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>DREAM TEAM</span>
            </button>

            <button
              onClick={() => onSelectTab('tournament')}
              disabled={picksCount < 5 || !hasCoach}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'tournament'
                  ? 'bg-gradient-to-r from-[#C9A45C] to-[#80683D] text-[#071018] font-bold shadow-md'
                  : picksCount < 5 || !hasCoach
                  ? 'text-[#91A0AA]/40 cursor-not-allowed'
                  : 'text-[#91A0AA] hover:text-[#F2F0E9]'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>TOURNAMENT</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRules(true)}
              className="p-2 rounded-lg bg-[#142330] hover:bg-[#1C3042] text-[#91A0AA] hover:text-[#C9A45C] border border-[#354653]/60 transition-colors"
              title="Luật chơi AOVDLE"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={onResetGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142330] hover:bg-[#1C3042] text-xs font-medium text-[#91A0AA] hover:text-[#D45B58] border border-[#354653]/60 transition-colors"
              title="Chơi lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D1923] border border-[#C9A45C]/50 rounded-2xl max-w-xl w-full p-6 text-[#F2F0E9] shadow-2xl shadow-[#C9A45C]/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#354653]">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#C9A45C]" />
                <h3 className="text-xl font-bold font-['Barlow_Condensed'] text-[#C9A45C]">
                  LUẬT CHƠI AOVDLE — ESPORTS DRAFT
                </h3>
              </div>
              <button
                onClick={() => setShowRules(false)}
                className="text-[#91A0AA] hover:text-[#F2F0E9] text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-[#91A0AA]">
              <div>
                <h4 className="font-bold text-[#F2F0E9] uppercase text-xs tracking-wider mb-1">
                  1. Player Draft (5 Vị trí)
                </h4>
                <p>
                  Mỗi lượt hiển thị 3 đội tuyển ngẫu nhiên từ lịch sử giải quốc tế (2019–2026). Chọn 1 đội để xem đội hình và chọn 1 tuyển thủ cho vị trí còn thiếu: <span className="text-[#C9A45C] font-semibold">DSL, Jungle, Mid, Farm, Support</span>. Bạn có tối đa 3 lần Reroll.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#F2F0E9] uppercase text-xs tracking-wider mb-1">
                  2. Coach Draft (1 Head Coach)
                </h4>
                <p>
                  Sau khi hoàn thành đủ 5 tuyển thủ, hệ thống rút 3 Head Coach lịch sử để bạn lựa chọn 1 HLV trưởng cho đội hình.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#F2F0E9] uppercase text-xs tracking-wider mb-1">
                  3. Strict Hidden Synergy (+5% Max)
                </h4>
                <p>
                  Kích hoạt tự động khi các tuyển thủ hoặc HLV từng thi đấu chung trong cùng một đội tuyển tại cùng một kỳ giải quốc tế.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#F2F0E9] uppercase text-xs tracking-wider mb-1">
                  4. APL 2026 Tournament Simulation
                </h4>
                <p>
                  Đưa Dream Team vào giải đấu 16 đội Swiss Stage. Thắng 3 trận để vào Playoffs Double Elimination, thua 3 trận bị loại!
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowRules(false)}
                className="px-5 py-2 rounded-xl bg-[#C9A45C] text-[#071018] font-bold font-['Barlow_Condensed'] text-sm tracking-wider hover:bg-[#C9A45C]/90"
              >
                ĐÃ HIỂU, TIẾP TỤC CHƠI
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
