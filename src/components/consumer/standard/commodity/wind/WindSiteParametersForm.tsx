import CommonSelect, { SelectOption } from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import {
  terrainClassOptions,
  WindSiteParametersFormErrors,
  WindSiteParametersFormValues,
  windSiteParametersSchema,
} from "@/store/consumer/standard/designs/wind/schema/siteParametersSchema";
import { useEffect, useState } from "react";

interface WindSiteParametersFormProps {
  parameters: WindSiteParametersFormValues;
  onChange: (parameters: WindSiteParametersFormValues) => void;
  onValidityChange?: (isValid: boolean) => void;
}

type FieldType = "number" | "text" | "select";

interface FieldConfig {
  key: keyof WindSiteParametersFormValues;
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

const CURRENCY_OPTIONS: readonly SelectOption<string>[] = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "NGN", label: "NGN — Nigerian Naira" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "KES", label: "KES — Kenyan Shilling" },
  { value: "ZAR", label: "ZAR — South African Rand" },
];

const SAVINGS_BASIS_OPTIONS: readonly SelectOption<string>[] = [
  { value: "gross", label: "Gross (before incentives)" },
  { value: "net", label: "Net (after incentives)" },
];

const TERRAIN_CLASS_OPTIONS: readonly SelectOption<string>[] =
  terrainClassOptions.map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  }));

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Site & Location",
    fields: [
      {
        key: "latitude",
        label: "Latitude",
        type: "number",
        step: 0.0001,
      },
      {
        key: "longitude",
        label: "Longitude",
        type: "number",
        step: 0.0001,
      },
      {
        key: "hubHeightMeters",
        label: "Hub Height (metres)",
        type: "number",
        helperText: "Tower height from ground to rotor centre",
      },
      {
        key: "avgWindSpeedMs",
        label: "Average Wind Speed (m/s)",
        type: "number",
        step: 0.1,
      },
      {
        key: "windSpeedReferenceHeightM",
        label: "Wind Speed Reference Height (m)",
        type: "number",
        helperText: "Height at which average wind speed was measured",
      },
      {
        key: "terrainClass",
        label: "Terrain Class",
        type: "select",
        options: TERRAIN_CLASS_OPTIONS,
      },
      {
        key: "obstacleMaxHeightM",
        label: "Nearby Obstacle Max Height (m)",
        type: "number",
      },
      {
        key: "obstacleDistanceM",
        label: "Nearby Obstacle Distance (m)",
        type: "number",
      },
    ],
  },
  {
    title: "Demand & Financial Parameters",
    fields: [
      {
        key: "demandKwhPerYear",
        label: "Annual Energy Demand (kWh)",
        type: "number",
        helperText: "Total yearly electricity consumption for this site",
      },
      {
        key: "tariffRatePerKwh",
        label: "Electricity Tariff Rate",
        type: "number",
        step: 0.01,
        helperText: "Cost per kWh in the site's currency",
      },
      {
        key: "currency",
        label: "Currency",
        type: "select",
        options: CURRENCY_OPTIONS,
      },
      {
        key: "escalationPct",
        label: "Tariff Escalation (%)",
        type: "number",
        step: 0.5,
        helperText: "Expected annual increase in electricity price",
      },
      {
        key: "horizonYears",
        label: "Analysis Horizon (years)",
        type: "number",
      },
      {
        key: "savingsBasis",
        label: "Savings Basis",
        type: "select",
        options: SAVINGS_BASIS_OPTIONS,
      },
    ],
  },
];

const WindSiteParametersForm: React.FC<WindSiteParametersFormProps> = ({
  parameters,
  onChange,
  onValidityChange,
}) => {
  const [errors, setErrors] = useState<WindSiteParametersFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof WindSiteParametersFormValues, boolean>>
  >({});

  useEffect(() => {
    const result = windSiteParametersSchema.safeParse(parameters);

    if (result.success) {
      setErrors({});
      onValidityChange?.(true);
      return;
    }

    const nextErrors: WindSiteParametersFormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof WindSiteParametersFormValues;
      if (!nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    });
    setErrors(nextErrors);
    onValidityChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  const markTouched = (key: keyof WindSiteParametersFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleFieldChange = (
    key: keyof WindSiteParametersFormValues,
    rawValue: string,
    type: FieldType,
  ) => {
    markTouched(key);

    const value: string | number =
      type === "number"
        ? rawValue === ""
          ? 0
          : parseFloat(rawValue)
        : rawValue;

    onChange({ ...parameters, [key]: value });
  };

  return (
    <div className="bg-white border border-[#E7E9E8] rounded-2xl">
      <div className="flex items-start gap-3 px-6 py-5">
        <span className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
          1
        </span>

        <SectionHeader
          size="lg"
          title="Site & Wind Parameters"
          description="These parameters are used to optimize turbine sizing, financial
          projections, and performance calculations"
        />
      </div>

      {FIELD_GROUPS.map((group, groupIndex) => (
        <div
          key={group.title}
          className="px-6 py-5 border-t border-[#E7E9E8]"
        >
          {groupIndex > 0 && (
            <h4 className="text-sm font-bold text-[#112518] mb-4">
              {group.title}
            </h4>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
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
                      type={field.type}
                      step={field.step}
                      value={value}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value, field.type)
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
    </div>
  );
};

export default WindSiteParametersForm;
