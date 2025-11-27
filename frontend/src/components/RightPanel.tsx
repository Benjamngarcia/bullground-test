import { IconPlus, IconUsers, IconTarget } from '@tabler/icons-react';

export default function RightPanel() {
  const portfolioData = {
    totalAUM: '12.65M USD',
    clients: 21,
    leads: 10,
    currentValue: '7.65M USD',
    growth: {
      percentage: '+35.7%',
      amount: '($351,124.22 USD)',
    },
  };

  const timePeriods = ['1M', '3M', '6M', 'YTD'];
  const activeTimePeriod = '1M';

  return (
    <aside className="w-80 bg-brand-darker border-l border-brand-border overflow-y-auto">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Portfolio</h2>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="col-span-3 bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <IconPlus size={14} stroke={1.5} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">Total AUM</span>
            </div>
            <p className="text-base font-semibold text-white">
              {portfolioData.totalAUM}
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <IconUsers size={14} stroke={1.5} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">Clients</span>
            </div>
            <p className="text-base font-semibold text-white">
              {portfolioData.clients}
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <IconTarget size={14} stroke={1.5} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">Leads</span>
            </div>
            <p className="text-base font-semibold text-white">
              {portfolioData.leads}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-white mb-0.5">{portfolioData.currentValue}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-emerald-500">
                {portfolioData.growth.percentage}
              </span>
              <span className="text-xs text-zinc-500">
                {portfolioData.growth.amount}
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Clients Portfolio Growth</p>

          <div className="h-32 relative mb-4">
            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M0,100 L20,90 L40,85 L60,80 L80,70 L100,65 L120,60 L140,55 L160,50 L180,45 L200,35 L220,30 L240,25 L260,20 L280,15 L300,10"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                className="animate-fade-in"
              />
            </svg>
          </div>

          <div className="flex gap-1.5">
            {timePeriods.map((period) => (
              <button
                key={period}
                className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  period === activeTimePeriod
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-base font-semibold text-white mb-0.5">{portfolioData.currentValue}</h3>
          <p className="text-xs text-zinc-500 mb-4">Client Portfolio Distribution</p>

          <div className="flex items-center justify-center mb-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3f3f46"
                  strokeWidth="18"
                  strokeDasharray="100.53 150.8"
                  className="transition-all"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#52525b"
                  strokeWidth="18"
                  strokeDasharray="150.8 100.53"
                  strokeDashoffset="-100.53"
                  className="transition-all"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
                <span className="text-xs text-zinc-400">Equity</span>
              </div>
              <span className="text-xs font-semibold text-white">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-500"></div>
                <span className="text-xs text-zinc-400">Fixed Income</span>
              </div>
              <span className="text-xs font-semibold text-white">60%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
