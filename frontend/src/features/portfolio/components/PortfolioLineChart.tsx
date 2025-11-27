import { Line } from 'react-chartjs-2';
import type { ScriptableContext, TooltipItem } from 'chart.js';

interface PortfolioLineChartProps {
  data: number[];
  labels: string[];
}

export default function PortfolioLineChart({ data, labels }: PortfolioLineChartProps) {
  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Portfolio Growth',
        data,
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

  return (
    <div className="h-40 relative mb-5">
      <Line data={lineChartData} options={lineChartOptions} />
    </div>
  );
}
