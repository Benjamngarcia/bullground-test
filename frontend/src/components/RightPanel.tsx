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
    <aside className="w-80 bg-brand-dark border-l border-gray-800 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Portfolio</h2>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            icon="💰"
            value={portfolioData.totalAUM}
            label="Total AUM"
            variant="primary"
          />
          <StatCard
            icon="👥"
            value={portfolioData.clients.toString()}
            label="Clients"
            variant="secondary"
          />
          <StatCard
            icon="🎯"
            value={portfolioData.leads.toString()}
            label="Leads"
            variant="secondary"
          />
        </div>

        <div className="bg-brand-gray rounded-xl p-4 mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-2xl font-bold text-white">{portfolioData.currentValue}</h3>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-brand-accent text-sm font-semibold">
              {portfolioData.growth.percentage}
            </span>
            <span className="text-brand-text-muted text-sm">
              {portfolioData.growth.amount}
            </span>
          </div>
          <p className="text-xs text-brand-text-muted mb-4">Clients Portfolio Growth</p>

          <div className="h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <path
                d="M0,100 L20,90 L40,85 L60,80 L80,70 L100,65 L120,60 L140,55 L160,50 L180,45 L200,35 L220,30 L240,25 L260,20 L280,15 L300,10"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                className="animate-fade-in"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex gap-2 mt-4">
            {timePeriods.map((period) => (
              <button
                key={period}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  period === activeTimePeriod
                    ? 'bg-brand-accent text-white'
                    : 'text-brand-text-muted hover:text-brand-text'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-brand-gray rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-1">{portfolioData.currentValue}</h3>
          <p className="text-xs text-brand-text-muted mb-4">Client Portfolio Distribution</p>

          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="20"
                  strokeDasharray="100.53 150.8"
                  className="transition-all"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="20"
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
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm text-brand-text">Equity</span>
              </div>
              <span className="text-sm font-medium text-white">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm text-brand-text">Fixed Income</span>
              </div>
              <span className="text-sm font-medium text-white">60%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  variant: 'primary' | 'secondary';
}

function StatCard({ icon, value, label, variant }: StatCardProps) {
  return (
    <div
      className={`rounded-lg p-3 ${
        variant === 'primary' ? 'bg-brand-gray col-span-3' : 'bg-brand-gray/50'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-brand-text-muted">{label}</span>
      </div>
      <p
        className={`font-bold ${
          variant === 'primary' ? 'text-lg' : 'text-base'
        } text-white`}
      >
        {value}
      </p>
    </div>
  );
}
