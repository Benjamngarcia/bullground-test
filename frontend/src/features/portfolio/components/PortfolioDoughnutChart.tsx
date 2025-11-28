import { VictoryPie } from 'victory';

interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

interface PortfolioDoughnutChartProps {
  distribution: DistributionItem[];
}

export default function PortfolioDoughnutChart({ distribution }: PortfolioDoughnutChartProps) {
  const chartData = distribution.map((item) => ({
    x: item.label,
    y: item.value,
  }));

  const leftItems = distribution.slice(Math.ceil(distribution.length / 2));
  const rightItems = distribution.slice(0, Math.ceil(distribution.length / 2));

  return (
    <div className="relative w-full h-56 flex items-center justify-between">
      <div className="flex flex-col gap-3 shrink-0">
        {leftItems.map((item, index) => (
          <div key={index} className="text-left">
            <div className="text-white text-md font-normal mb-0.5">
              {item.label}
            </div>
            <div className="text-white text-xl font-bold">
              {item.value}%
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center shrink-0">
        <VictoryPie
          data={chartData}
          width={280}
          height={280}
          innerRadius={0}
          padAngle={0}
          colorScale={distribution.map((item) => item.color)}
          style={{
            data: {
              stroke: "none",
            },
            labels: {
              fill: "transparent",
            },
          }}
          labels={() => ''}
        />
      </div>

      <div className="flex flex-col gap-3 shrink-0">
        {rightItems.map((item, index) => (
          <div key={index} className="text-right">
            <div className="text-white text-md font-normal mb-0.5">
              {item.label}
            </div>
            <div className="text-white text-xl font-bold">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
