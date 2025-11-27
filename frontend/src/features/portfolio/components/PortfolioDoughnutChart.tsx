import { Doughnut } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';

interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

interface PortfolioDoughnutChartProps {
  distribution: DistributionItem[];
}

export default function PortfolioDoughnutChart({ distribution }: PortfolioDoughnutChartProps) {
  const doughnutChartData = {
    labels: distribution.map((item) => item.label),
    datasets: [
      {
        data: distribution.map((item) => item.value),
        backgroundColor: distribution.map((item) => item.color),
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
    <div className="w-48 h-48">
      <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
    </div>
  );
}
