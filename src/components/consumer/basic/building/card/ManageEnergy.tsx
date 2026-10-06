import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import { BuildingApplianceReport } from "@/store/consumer/basic/appliance/types/appliance";
import { BarChart3, DollarSign, TrendingUp, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BarTooltip from "../management/BarTooltip";
import PieTooltip from "../management/PieTooltip";
import BMiniCard from "./BMiniCard";

interface ManageEnergyProps {
  report?: BuildingApplianceReport;
  isLoading?: boolean;
}

// Fallback palette applied in order to whatever categories the API returns
const CATEGORY_COLORS: Record<string, string> = {
  cooling: "#3b82f6",
  kitchen: "#f59e0b",
  lighting: "#10b981",
  entertainment: "#8b5cf6",
  office: "#ec4899",
  laundry: "#06b6d4",
};
const FALLBACK_PALETTE = [
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

const ManageEnergy = ({ report, isLoading }: ManageEnergyProps) => {
  const summary = report?.summary;

  const summaryCards = [
    {
      icon: Zap,
      iconColorClassName: "text-[#2DAD00]",
      iconBgClassName: "bg-[#2DAD00]/10",
      label: "Total Appliances",
      value: summary?.totalAppliances ?? 0,
      des: `Across ${summary?.roomCount ?? 0} room${
        (summary?.roomCount ?? 0) === 1 ? "" : "s"
      }`,
    },
    {
      icon: TrendingUp,
      iconColorClassName: "text-[#D08700]",
      iconBgClassName: "bg-[#FEF9C2]",
      label: "Daily Usage",
      value: `${(summary?.dailyUsageKwh ?? 0).toFixed(2)} kWh`,
      des: "kWh per day",
    },
    {
      icon: BarChart3,
      iconColorClassName: "text-[#155DFC]",
      iconBgClassName: "bg-[#DBEAFE]",
      label: "Monthly Usage",
      value: `${(summary?.monthlyUsageKwh ?? 0).toFixed(0)}`,
      des: "kWh",
    },
    {
      icon: DollarSign,
      iconColorClassName: "text-[#00A63E]",
      iconBgClassName: "bg-[#DCFCE7]",
      label: "Monthly Cost",
      value: `$${(summary?.monthlyCost ?? 0).toFixed(2)}`,
      valueClass: "text-emerald-600",
      des: `at $${(summary?.tariffRate ?? 0).toFixed(2)}/kWh`,
    },
  ];

  const categoryData = (report?.energyUsageByCategory ?? []).map(
    (cat, index) => ({
      name: cat.category,
      value: cat.percentage,
      color:
        CATEGORY_COLORS[cat.category_key] ??
        FALLBACK_PALETTE[index % FALLBACK_PALETTE.length],
    }),
  );

  const roomUsageData = (report?.dailyEnergyUsageByRoom ?? []).map((room) => ({
    room: room.roomName,
    usage: room.dailyUsageKwh,
  }));

  const maxRoomUsage = Math.max(1, ...roomUsageData.map((r) => r.usage));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <BMiniCard
            key={index}
            className="border-[#E7E9E8]! bg-white! shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]"
            icon={card.icon}
            iconColorClassName={card.iconColorClassName}
            iconBgClassName={card.iconBgClassName}
            label={card.label}
            value={card.value}
            valueClass={card.valueClass}
            des={card.des}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Energy Usage by Category" />
          <div className="h-72">
            {categoryData.length === 0 && !isLoading ? (
              <p className="text-sm text-slate-400 py-6 text-center">
                No category data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={{ stroke: "#94a3b8" }}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CommonBorderWrapper>

        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Energy Usage by Room" />

          <div className="h-72">
            {roomUsageData.length === 0 && !isLoading ? (
              <p className="text-sm text-slate-400 py-6 text-center">
                No room usage data available.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roomUsageData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="room"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, Math.ceil(maxRoomUsage * 1.2)]}
                  />
                  <Tooltip
                    content={<BarTooltip />}
                    cursor={{ fill: "#f1f5f9" }}
                  />
                  <Legend
                    formatter={() => "Usage (kWh)"}
                    wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                  />
                  <Bar
                    dataKey="usage"
                    fill="#2DAD00"
                    radius={[4, 4, 0, 0]}
                    barSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CommonBorderWrapper>
      </div>
    </div>
  );
};

export default ManageEnergy;
