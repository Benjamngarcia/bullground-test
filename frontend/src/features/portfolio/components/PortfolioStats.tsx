import {
  IconUsers,
  IconCurrencyDollar,
  IconUserSearch,
} from "@tabler/icons-react";
import StatCard from "../../../shared/ui/StatCard";

interface PortfolioData {
  totalAUM: string;
  clients: number;
  leads: number;
}

interface PortfolioStatsProps {
  data: PortfolioData;
}

export default function PortfolioStats({ data }: PortfolioStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <StatCard
        icon={<IconCurrencyDollar size={24} stroke={1.2} />}
        value={data.totalAUM}
        label="Total AUM"
      />
      <StatCard
        icon={<IconUsers size={24} stroke={1.2} />}
        value={data.clients}
        label="Clients"
      />
      <StatCard
        icon={<IconUserSearch size={24} stroke={1.2} />}
        value={data.leads}
        label="Leads"
      />
    </div>
  );
}
