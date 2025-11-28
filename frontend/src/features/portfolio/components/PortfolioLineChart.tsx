import { VictoryLine, VictoryChart, VictoryAxis } from 'victory';

interface PortfolioLineChartProps {
  data: number[];
  labels: string[];
}

export default function PortfolioLineChart({ data }: PortfolioLineChartProps) {
  const chartData = data.map((value, index) => ({
    x: index + 1,
    y: value,
  }));

  return (
    <div className="h-40 relative mb-5">
      <VictoryChart
        width={600}
        height={160}
        padding={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fill: "transparent" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fill: "transparent" },
            grid: { stroke: "transparent" },
          }}
        />

        <VictoryLine
          data={chartData}
          interpolation="linear"
          style={{
            data: {
              stroke: "#00a294",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
          }}
        />
      </VictoryChart>
    </div>
  );
}
