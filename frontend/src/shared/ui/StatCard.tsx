import { type ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
}

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-linear-to-br from-zinc-800/50 to-transparent border border-zinc-700 rounded-xl px-2 py-5 relative overflow-hidden flex items-center">
      <div className="flex gap-2 items-center">
        <div className="text-zinc-400 size-8">
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="text-md font-bold text-white">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
