import CommonSelect, { SelectOption } from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import {
  buildCoolingLoadProfile,
  toCoolingLoadProfilePoints,
} from "@/store/consumer/standard/designs/hvac/coolingLoadProfile";
import {
  currencyOptions,
  HvacSiteParametersFormErrors,
  HvacSiteParametersFormValues,
  hvacSiteParametersSchema,
} from "@/store/consumer/standard/designs/hvac/schema/siteParametersSchema";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HvacSiteParametersFormProps {
  parameters: HvacSiteParametersFormValues;
  onChange: (parameters: HvacSiteParametersFormValues) => void;
  onValidityChange?: (isValid: boolean) => void;
}

type FieldType = "number" | "select";

interface FieldConfig {
  key: keyof HvacSiteParametersFormValues;
  label: string;
  type: FieldType;
  helperText?: string;
  step?: number;
  options?: readonly SelectOption<string>[];
}

interface FieldGroup {
  title: string;
  fields: FieldConfig[];
}

const CURRENCY_OPTIONS: readonly SelectOption<string>[] = currencyOptions.map(
  (code) => ({ value: code, label: code }),
);

const SIZING_MODE_OPTIONS: readonly SelectOption<string>[] = [
  { value: "size-to-load", label: "Size to building load" },
];

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Building Load",
    fields: [
      {
        key: "annualLoadKwh",
        label: "Annual Load (kWh)",
        type: "number",
        helperText: "Total yearly HVAC electricity consumption",
      },
      {
        key: "peakCoolingLoadKw",
        label: "Peak Cooling Load (kW)",
        type: "number",
        step: 0.1,
        helperText: "Highest cooling demand across the day",
      },
      {
        key: "baseCoolingLoadKw",
        label: "Overnight Base Load (kW)",
        type: "number",
        step: 0.1,
        helperText: "Demand that persists through the night",
      },
      {
        key: "peakHour",
        label: "Peak Hour (0–23)",
        type: "number",
        helperText: "Hour of day the cooling load peaks",
      },
    ],
  },
  {
    title: "Finance & Sizing Options",
    fields: [
      {
        key: "electricityTariffRate",
        label: "Electricity Tariff Rate",
        type: "number",
        step: 0.01,
        helperText: "Cost per kWh drawn from the grid",
      },
      {
        key: "currency",
        label: "Currency",
        type: "select",
        options: CURRENCY_OPTIONS,
      },
      {
        key: "horizonYears",
        label: "Analysis Horizon (years)",
        type: "number",
      },
      {
        key: "sizingMode",
        label: "Sizing Mode",
        type: "select",
        options: SIZING_MODE_OPTIONS,
      },
    ],
  },
];

const HvacSiteParametersForm: React.FC<HvacSiteParametersFormProps> = ({
  parameters,
  onChange,
  onValidityChange,
}) => {
  const [errors, setErrors] = useState<HvacSiteParametersFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof HvacSiteParametersFormValues, boolean>>
  >({});

  // Re-validate whenever parameters change (user edits or parent-driven resets)
  useEffect(() => {
    const result = hvacSiteParametersSchema.safeParse(parameters);

    if (result.success) {
      setErrors({});
      onValidityChange?.(true);
      return;
    }

    const nextErrors: HvacSiteParametersFormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof HvacSiteParametersFormValues;
      if (!nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    });
    setErrors(nextErrors);
    onValidityChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  // The solve endpoint takes a 24-hour profile, so show the curve derived from
  // the three scalar inputs above rather than sending it unseen
  const profilePoints = useMemo(
    () =>
      toCoolingLoadProfilePoints(
        buildCoolingLoadProfile({
          peakCoolingLoadKw: parameters.peakCoolingLoadKw,
          baseCoolingLoadKw: parameters.baseCoolingLoadKw,
          peakHour: parameters.peakHour,
        }),
      ),
    [
      parameters.peakCoolingLoadKw,
      parameters.baseCoolingLoadKw,
      parameters.peakHour,
    ],
  );

  const markTouched = (key: keyof HvacSiteParametersFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleFieldChange = (
    key: keyof HvacSiteParametersFormValues,
    rawValue: string,
  ) => {
    markTouched(key);
    onChange({
      ...parameters,
      [key]: rawValue === "" ? 0 : parseFloat(rawValue),
    });
  };

  return (
    <div className="bg-white border border-[#E7E9E8] rounded-2xl">
      <div className="flex items-start gap-3 px-6 py-5">
        <span className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
          1
        </span>

        <SectionHeader
          size="lg"
          title="Building Load & Financial Parameters"
          description="These parameters drive the load profile, equipment sizing and
          financial analysis"
        />
      </div>

      {FIELD_GROUPS.map((group, groupIndex) => (
        <div key={group.title} className="px-6 py-5 border-t border-[#E7E9E8]">
          {groupIndex > 0 && (
            <h4 className="text-sm font-bold text-[#112518] mb-4">
              {group.title}
            </h4>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
            {group.fields.map((field) => {
              const errorMessage = touched[field.key]
                ? errors[field.key]
                : undefined;
              const value = parameters[field.key];

              return (
                <div key={field.key}>
                  <label htmlFor={field.key} className={inputClass.label}>
                    {field.label}
                  </label>

                  {field.type === "select" ? (
                    <CommonSelect
                      value={value as string}
                      item={field.options ?? []}
                      onValueChange={(val) => {
                        markTouched(field.key);
                        onChange({ ...parameters, [field.key]: val });
                      }}
                      placeholder={`Select ${field.label.toLowerCase()}`}
                      className={`w-full ${
                        errorMessage ? "border-red-500" : ""
                      }`}
                    />
                  ) : (
                    <input
                      id={field.key}
                      type="number"
                      step={field.step}
                      value={value}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      onBlur={() => markTouched(field.key)}
                      aria-invalid={!!errorMessage}
                      aria-describedby={
                        errorMessage ? `${field.key}-error` : undefined
                      }
                      className={`${inputClass.input} ${
                        errorMessage
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                  )}

                  {errorMessage ? (
                    <p
                      id={`${field.key}-error`}
                      className="text-xs text-red-600 mt-1.5"
                    >
                      {errorMessage}
                    </p>
                  ) : (
                    field.helperText && (
                      <p className="text-xs text-[#758179] mt-1.5">
                        {field.helperText}
                      </p>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="px-6 py-5 border-t border-[#E7E9E8]">
        <h4 className="text-sm font-bold text-[#112518]">
          Hourly Cooling Load Profile
        </h4>
        <p className="text-xs text-[#758179] mt-1 mb-4">
          Derived from the peak load, base load and peak hour above. This is the
          24-hour profile sent to the solver.
        </p>

        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={profilePoints}
              margin={{ top: 4, right: 8, left: -12, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="hour"
                interval={2}
                axisLine={{ stroke: "#D1D5DB" }}
                tickLine={false}
                tick={{ fill: "#758179", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#758179", fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number) => [`${value} kW`, "Cooling load"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="loadKw"
                stroke="#0EA5E9"
                fill="#0EA5E9"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HvacSiteParametersForm;
