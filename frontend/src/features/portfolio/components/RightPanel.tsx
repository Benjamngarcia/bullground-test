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
} from "chart.js";
import PortfolioStats from "./PortfolioStats";
import PortfolioLineChart from "./PortfolioLineChart";
import PortfolioDoughnutChart from "./PortfolioDoughnutChart";
import Card from "../../../shared/ui/Card";
import Button from "../../../shared/ui/Button";

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

  const lineChartLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const lineChartData = [
    5.2, 4.8, 5.48, 5.62, 5.34, 6.05, 6.18, 6.42, 6.58, 6.45, 7.15, 7.65,
  ];

  const portfolioDistribution = [
    { label: "Equity", value: 40, color: "#71717a" },
    { label: "Fixed Income", value: 60, color: "#52525b" },
  ];

  return (
    <aside className="flex-1 bg-brand-dark border-l border-brand-border overflow-y-auto relative z-10">
      <div className="p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-white mb-5">Portfolio</h2>

        <PortfolioStats data={portfolioData} />

        <Card variant="elevated" className="p-5 mb-5 relative overflow-hidden">
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

            <PortfolioLineChart data={lineChartData} labels={lineChartLabels} />
          </div>

          <div className="flex gap-1.5">
            {timePeriods.map((period) => (
              <Button
                key={period}
                variant={period === activeTimePeriod ? "primary" : "ghost"}
                size="sm"
                className="flex-1"
              >
                {period}
              </Button>
            ))}
          </div>
        </Card>

        <Card variant="elevated" className="p-6 relative overflow-hidden">
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
              <PortfolioDoughnutChart distribution={portfolioDistribution} />
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
}
