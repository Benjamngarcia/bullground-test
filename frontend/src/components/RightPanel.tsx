import {
  IconUsers,
  IconCurrencyDollar,
  IconUserSearch,
} from "@tabler/icons-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  type ScriptableContext,
  type TooltipItem,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

export default function RightPanel() {
  const portfolioData = {
    totalAUM: "12.65M USD",
    clients: 21,
    leads: 10,
    currentValue: "7.65M USD",
    growth: {
      percentage: "+35.7%",
      amount: "($351,124.22 USD)",
    },
  };

  const timePeriods = ["1M", "3M", "6M", "YTD"];
  const activeTimePeriod = "1M";

  // Line chart data - realistic portfolio growth with natural variations
  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Portfolio Growth",
        data: [
          5.2, 4.8, 5.48, 5.62, 5.34, 6.05, 6.18, 6.42, 6.58, 6.45, 7.15, 7.65,
        ],
        fill: true,
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
          return gradient;
        },
        borderColor: "#00a294",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#00a294",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#18181b",
        titleColor: "#fafafa",
        bodyColor: "#a1a1aa",
        borderColor: "#3f3f46",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            return `${context.parsed.y ?? 0}M USD`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  // Pie chart data - portfolio distribution
  const portfolioDistribution = [
    { label: "Equity", value: 40, color: "#71717a" },
    { label: "Fixed Income", value: 60, color: "#52525b" },
  ];

  const doughnutChartData = {
    labels: portfolioDistribution.map((item) => item.label),
    datasets: [
      {
        data: portfolioDistribution.map((item) => item.value),
        backgroundColor: portfolioDistribution.map((item) => item.color),
        borderWidth: 0,
        spacing: 0,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "0%",
    spacing: 0,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#18181b",
        titleColor: "#fafafa",
        bodyColor: "#a1a1aa",
        borderColor: "#3f3f46",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <aside className="flex-1 bg-brand-dark border-l border-brand-border overflow-y-auto relative z-10">
      <div className="p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-white mb-5">Portfolio</h2>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-linear-to-br from-zinc-800/50 to-transparent border border-zinc-700 rounded-xl px-2 py-5 relative overflow-hidden flex items-center">
            <div className="flex gap-2 items-center">
              <IconCurrencyDollar
                size={16}
                stroke={1.2}
                className="text-zinc-400 size-8"
              />
              <div className="flex flex-col">
                <p className="text-md font-bold text-white">
                  {portfolioData.totalAUM}
                </p>
                <p className="text-xs text-zinc-500">Total AUM</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-zinc-800/50 to-transparent border border-zinc-700 rounded-xl px-2 py-5 relative overflow-hidden flex items-center">
            <div className="flex gap-2 items-center">
              <IconUsers
                size={16}
                stroke={1.2}
                className="text-zinc-400 size-8"
              />
              <div className="flex flex-col">
                <p className="text-md font-bold text-white">
                  {portfolioData.clients}
                </p>
                <p className="text-xs text-zinc-500">Clients</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-zinc-800/50 to-transparent border border-zinc-700 rounded-xl px-2 py-5 relative overflow-hidden flex items-center">
            <div className="flex gap-2 items-center">
              <IconUserSearch
                size={16}
                stroke={1.2}
                className="text-zinc-400 size-8"
              />
              <div className="flex flex-col">
                <p className="text-md font-bold text-white">
                  {portfolioData.leads}
                </p>
                <p className="text-xs text-zinc-500">Leads</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-5 mb-5 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">
                {portfolioData.currentValue}
              </h3>
              <div className="flex items-center gap-2 text-sm text-brand-accent">
                <span>{portfolioData.growth.percentage}</span>
                <span>{portfolioData.growth.amount}</span>
              </div>
              <p className="text-sm text-brand-text-muted mb-4">
                Clients Portfolio Growth
              </p>
            </div>

            <div className="h-40 relative mb-5">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          <div className="flex gap-1.5">
            {timePeriods.map((period) => (
              <button
                key={period}
                className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  period === activeTimePeriod
                    ? "bg-brand-accent text-white"
                    : "text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-linear-to-br from-zinc-900 to-zinc-900/30 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute -left-6 -top-6 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="relative">
            <h3 className="text-xl font-bold text-white mb-1">
              {portfolioData.currentValue}
            </h3>
            <p className="text-sm text-zinc-500 mb-8">
              Client Portfolio Distribution
            </p>

            <div className="flex items-center justify-center mb-8 gap-8">
              {/* Chart */}
              <div className="w-48 h-48">
                <Doughnut
                  data={doughnutChartData}
                  options={doughnutChartOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
