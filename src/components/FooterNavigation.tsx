import React from 'react';

export const FooterNavigation: React.FC = () => {
  const links = [
    {
      label: '🎮 Chơi Ngay Bản Web 3D Online',
      url: 'https://chu0n6-iot.github.io/AOVDLE/',
    },
    {
      label: 'Tài liệu Kế hoạch Gốc',
      url: 'https://github.com/chu0n6-iot/AOVDLE/blob/main/README.md',
    },
    {
      label: 'Kế hoạch Phát triển iOS',
      url: 'https://github.com/chu0n6-iot/AOVDLE/blob/main/IOS_DEVELOPMENT_PLAN.md',
    },
    {
      label: 'Kho Dữ liệu Game',
      url: 'https://github.com/chu0n6-iot/AOVDLE/tree/main/data',
    },
    {
      label: 'Đóng góp sự kiện',
      url: 'https://github.com/chu0n6-iot/AOVDLE/blob/main/CONTRIBUTING.md',
    },
  ];

  return (
    <footer className="border-t border-[#354653]/40 py-5 bg-[#071018] text-center shrink-0">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
        <nav className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm">
          {links.map((link, idx) => (
            <React.Fragment key={idx}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#61DAFB] hover:text-[#90E0EF] underline transition-colors"
              >
                {link.label}
              </a>
              {idx < links.length - 1 && (
                <span className="text-[#91A0AA] select-none text-xs">•</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        <p className="text-[11px] text-[#91A0AA]/70 mt-1">
          AOVDLE — Arena of Valor Draft & Tournament Simulation 2017–2026 • Dữ liệu AIC, APL, AWC
        </p>
      </div>
    </footer>
  );
};

export default FooterNavigation;
