import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import BMiniCard from "@/components/consumer/basic/building/card/BMiniCard";
import {
  SolveSolarDesignData,
  SizingMetric,
} from "@/store/consumer/standard/designs/solar/types/solarDesign";
import { Compass, DollarSign, Leaf, Sun, TrendingUp, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import InfoRow from "./InfoRow";

interface SystemResultsProps {
  results: SolveSolarDesignData;
}

const NOT_AVAILABLE = "—";

const formatMoney = (amount: number | null | undefined, currency: string) => {
  if (amount === null || amount === undefined) return NOT_AVAILABLE;
  const prefix = currency === "USD" ? "$" : `${currency} `;
  return `${prefix}${amount.toLocaleString()}`;
};

const formatSizingValue = (
  metric: SizingMetric | null | undefined,
  options?: { asPercent?: boolean; decimals?: number },
) => {
  if (!metric) return NOT_AVAILABLE;
  if (options?.asPercent) return `${metric.value}%`;
  if (options?.decimals !== undefined) {
    return metric.value.toFixed(options.decimals);
  }
  return metric.value.toLocaleString();
};

const formatSizingDes = (metric: SizingMetric | null | undefined) =>
  metric?.sub_label || metric?.unit || undefined;

const SolarSystemResults: React.FC<SystemResultsProps> = ({ results }) => {
  const {
    sizing,
    technical_specifications,
    financial_analysis,
    monthly_profile,
    site_suitability,
    environmental_benefits,
  } = results;

  const { array_analysis, system_configuration } = technical_specifications;
  const specs = system_configuration.specs;

  const chartData = (monthly_profile ?? []).map((m) => ({
    month: m.month,
    consumption: m.consumption_kwh,
    production: m.production_kwh,
  }));

  const panelWattage =
    system_configuration.panel_wattage_w ?? specs?.rated_power_w ?? null;
  const panelEfficiency =
    system_configuration.panel_efficiency_pct ??
    specs?.module_efficiency_pct ??
    null;

  const panelDetails = [
    {
      label: "Total Panels:",
      value: `${sizing.panel_count.value} units`,
    },
    {
      label: "Panel Wattage:",
      value:
        panelWattage === null ? NOT_AVAILABLE : `${panelWattage}W each`,
    },
    {
      label: "Panel Efficiency:",
      value:
        panelEfficiency === null ? NOT_AVAILABLE : `${panelEfficiency}%`,
    },
    {
      label: "Array Configuration:",
      value: system_configuration.array_configuration ?? NOT_AVAILABLE,
    },
    {
      label: "Roof Coverage:",
      value: `${array_analysis.array_area_sqft.toLocaleString()} sq ft`,
    },
    {
      label: "Roof Utilisation:",
      value: `${array_analysis.roof_utilisation_pct}%`,
    },
    {
      label: "Fits Available Roof:",
      value: array_analysis.fits_available_roof ? "Yes" : "No",
    },
  ];

  const financialDetails = [
    {
      label: "System Cost:",
      value: formatMoney(
        financial_analysis.system_cost,
        financial_analysis.currency,
      ),
    },
    {
      label: "Tax Credit:",
      value: formatMoney(
        financial_analysis.tax_credit_amount,
        financial_analysis.currency,
      ),
    },
    {
      label: "Net Cost:",
      value: formatMoney(
        financial_analysis.net_cost,
        financial_analysis.currency,
      ),
    },
    {
      label: "Annual Savings:",
      value: formatMoney(
        financial_analysis.annual_savings,
        financial_analysis.currency,
      ),
      valueClassName: "text-green-600",
    },
    {
      label: "Payback Period:",
      value:
        financial_analysis.payback_period_years === null
          ? NOT_AVAILABLE
          : `${financial_analysis.payback_period_years} years`,
    },
    {
      label: `${financial_analysis.horizon_years}-Year ROI:`,
      value:
        financial_analysis.roi_percent === null
          ? NOT_AVAILABLE
          : `${financial_analysis.roi_percent}%`,
      valueClassName: "text-green-600",
    },
  ];

  const suitabilityCards = [
    {
      key: "roof_orientation",
      label: "Roof Orientation",
      metric: site_suitability.roof_orientation,
      icon: Compass,
    },
    {
      key: "shading_analysis",
      label: "Shading Analysis",
      metric: site_suitability.shading_analysis,
      icon: Sun,
    },
    {
      key: "solar_irradiance",
      label: "Solar Irradiance",
      metric: site_suitability.solar_irradiance,
      icon: Zap,
    },
  ];

  return (
    <div className="space-y-6">
      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Solar Sizing Results" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <BMiniCard
            icon={Sun}
            label="System Capacity"
            value={`${sizing.system_capacity.value.toFixed(1)} kW`}
            des={formatSizingDes(sizing.system_capacity)}
            bgClassName="bg-amber-50/70 flex flex-col items-center justify-center"
            iconClassName=" flex! flex-col! items-center! justify-center! "
            iconBgClassName=""
            iconColorClassName="text-amber-600 w-8! h-8!"
            valueClass="text-amber-600 font-bold!"
          />
          <BMiniCard
            icon={Zap}
            label="Panel Count"
            value={sizing.panel_count.value.toString()}
            des={formatSizingDes(sizing.panel_count)}
            bgClassName="bg-green-50/70 flex flex-col items-center justify-center"
            iconClassName=" flex! flex-col! items-center! justify-center! "
            iconBgClassName=""
            iconColorClassName="text-green-600 w-8! h-8!"
            valueClass="text-green-600 font-bold!"
          />
          <BMiniCard
            icon={TrendingUp}
            label="Annual Production"
            value={formatSizingValue(sizing.annual_production)}
            des={formatSizingDes(sizing.annual_production) ?? "kWh"}
            bgClassName="bg-green-50/70 flex flex-col items-center justify-center"
            iconClassName=" flex! flex-col! items-center! justify-center! "
            iconBgClassName=""
            iconColorClassName="text-green-600 w-8! h-8!"
            valueClass="text-green-600 font-bold!"
          />
          <BMiniCard
            icon={DollarSign}
            label="Coverage"
            value={formatSizingValue(sizing.energy_coverage, {
              asPercent: true,
            })}
            des={formatSizingDes(sizing.energy_coverage)}
            bgClassName="bg-blue-50/70 flex flex-col items-center justify-center"
            iconClassName=" flex! flex-col! items-center! justify-center! "
            iconBgClassName=""
            iconColorClassName="text-blue-600 w-8! h-8!"
            valueClass="text-blue-600 font-bold!"
          />
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Site Suitability" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suitabilityCards.map(({ key, label, metric, icon: Icon }) => (
            <BMiniCard
              key={key}
              icon={Icon}
              label={label}
              value={metric.rating}
              des={
                metric.caption
                  ? `${metric.caption} · ${metric.score_pct}%`
                  : `${metric.score_pct}% score`
              }
              bgClassName="bg-amber-50/50 flex flex-col items-center justify-center"
              iconClassName=" flex! flex-col! items-center! justify-center! "
              iconBgClassName=""
              iconColorClassName="text-amber-600 w-8! h-8!"
              valueClass="text-[#112518] font-bold!"
            />
          ))}
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Technical Specifications" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 ">
          <div className="space-y-4">
            <SectionHeader size="lg" title="System Configuration" />
            <dl className="space-y-2">
              {panelDetails.map((item) => (
                <InfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </dl>
          </div>

          <div className="space-y-4">
            <SectionHeader size="lg" title="Financial Analysis" />
            <dl className="space-y-2">
              {financialDetails.map((item) => (
                <InfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  valueClassName={item.valueClassName}
                />
              ))}
            </dl>
          </div>
        </div>
      </CommonBorderWrapper>

      <CommonBorderWrapper isShadow>
        <SectionHeader size="xl" title="Cost Breakdown" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <BMiniCard
            className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
            label="Equipment Cost"
            value={formatMoney(
              financial_analysis.equipment_cost,
              financial_analysis.currency,
            )}
          />
          <BMiniCard
            className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
            label="Installation"
            value={formatMoney(
              financial_analysis.installation_cost,
              financial_analysis.currency,
            )}
          />
          <BMiniCard
            className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
            label="Total Investment"
            value={formatMoney(
              financial_analysis.total_investment,
              financial_analysis.currency,
            )}
          />
          <BMiniCard
            className="flex flex-col items-center justify-center bg-[#EAF7E6]/30! "
            label="Tax Credit"
            value={formatMoney(
              financial_analysis.tax_credit_amount,
              financial_analysis.currency,
            )}
            valueClass="text-green-600! font-bold!"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label="Annual Savings"
            value={formatMoney(
              financial_analysis.annual_savings,
              financial_analysis.currency,
            )}
            valueClass="text-green-600! font-bold! text-2xl!"
          />
          <BMiniCard
            className="flex flex-col items-start justify-center bg-[#EAF7E6]/30! "
            label={`${financial_analysis.horizon_years}-Year Savings`}
            value={formatMoney(
              financial_analysis.lifetime_savings,
              financial_analysis.currency,
            )}
            valueClass="text-green-600! font-bold! text-2xl!"
          />
        </div>
      </CommonBorderWrapper>

      {environmental_benefits.length > 0 && (
        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Environmental Benefits" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {environmental_benefits.map((benefit) => (
              <BMiniCard
                key={benefit.title}
                icon={Leaf}
                label={benefit.title}
                value={benefit.value}
                des={benefit.note}
                bgClassName="bg-white flex flex-col items-start justify-center"
                iconBgClassName="bg-[#EAF7E6]"
                iconColorClassName="text-primary w-6! h-6!"
                valueClass="text-[#112518]! font-bold!"
              />
            ))}
          </div>
        </CommonBorderWrapper>
      )}

      {chartData.length > 0 && (
        <CommonBorderWrapper isShadow>
          <SectionHeader size="xl" title="Monthly Production vs. Consumption" />
          <div className="h-72 ">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend
                  formatter={(value) =>
                    value === "consumption"
                      ? "Consumption (kWh)"
                      : "Solar Production (kWh)"
                  }
                />
                <Bar
                  dataKey="consumption"
                  fill="#6b7280"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="production"
                  fill="#f59e0b"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CommonBorderWrapper>
      )}
    </div>
  );
};

export default SolarSystemResults;
