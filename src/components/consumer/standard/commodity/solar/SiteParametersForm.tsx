import CommonSelect, { SelectOption } from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import {
  SiteParametersFormErrors,
  SiteParametersFormValues,
  siteParametersSchema,
  usageProfileOptions,
} from "@/store/consumer/standard/designs/solar/schema/siteParametersSchema";
import { useEffect, useState } from "react";

interface SiteParametersFormProps {
  parameters: SiteParametersFormValues;
  onChange: (parameters: SiteParametersFormValues) => void;
  onValidityChange?: (isValid: boolean) => void;
}

type FieldType = "number" | "text" | "select";

interface FieldConfig {
  key: keyof SiteParametersFormValues;
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

const PAYBACK_BASIS_OPTIONS: readonly SelectOption<string>[] = [
  { value: "gross", label: "Gross (before tax credit)" },
  { value: "net", label: "Net (after tax credit)" },
];

const USAGE_PROFILE_OPTIONS: readonly SelectOption<string>[] =
  usageProfileOptions.map((value) => ({
    value,
    label: value
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
  }));

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Site & Location",
    fields: [
      {
        key: "locationLabel",
        label: "Site Location",
        type: "text",
        helperText: 'Used for solar design lookup, e.g. "Lagos, Nigeria"',
      },
      {
        key: "latitude",
        label: "Latitude",
        type: "number",
        step: 0.0001,
        helperText: "Site latitude in decimal degrees",
      },
      {
        key: "currency",
        label: "Currency",
        type: "select",
        options: CURRENCY_OPTIONS,
      },
      {
        key: "totalRoofAreaSqFt",
        label: "Total Roof Area (sq ft)",
        type: "number",
      },
      {
        key: "availableRoofAreaSqFt",
        label: "Available Roof Area (sq ft)",
        type: "number",
      },
      {
        key: "solarIrradiance",
        label: "Solar Irradiance (kWh/m²/day)",
        type: "number",
        step: 0.1,
      },
      {
        key: "tiltAngleDegrees",
        label: "Tilt Angle (degrees)",
        type: "number",
      },
      {
        key: "azimuthDegrees",
        label: "Azimuth (degrees)",
        type: "number",
        helperText: "180° = South facing",
      },
      {
        key: "systemLossFactorPct",
        label: "System Loss Factor (%)",
        type: "number",
        helperText: "Includes soiling, wiring, inverter losses",
      },
      {
        key: "shadingFactor",
        label: "Shading Factor",
        type: "number",
        step: 0.01,
        helperText: "1 = no shading, 0 = fully shaded",
      },
      {
        key: "gridEmissionFactorKgKwh",
        label: "Grid Emission Factor (kg/kWh)",
        type: "number",
        step: 0.01,
      },
    ],
  },
  {
    title: "Demand & Financial Parameters",
    fields: [
      {
        key: "annualLoadKwh",
        label: "Annual Energy Load (kWh)",
        type: "number",
        helperText: "Total yearly electricity consumption for this site",
      },
      {
        key: "usageProfile",
        label: "Usage Profile",
        type: "select",
        options: USAGE_PROFILE_OPTIONS,
      },
      {
        key: "criticalLoadKw",
        label: "Critical Load (kW)",
        type: "number",
        step: 0.1,
      },
      {
        key: "electricityTariffRate",
        label: "Electricity Tariff Rate",
        type: "number",
        step: 0.01,
        helperText: "Cost per kWh in the site's currency",
      },
      {
        key: "taxCreditPercentage",
        label: "Tax Credit (%)",
        type: "number",
        step: 1,
        helperText: "Applicable incentive as a percentage of system cost",
      },
      {
        key: "annualDegradationPct",
        label: "Annual Degradation (%)",
        type: "number",
        step: 0.1,
      },
      {
        key: "escalationPct",
        label: "Tariff Escalation (%)",
        type: "number",
        step: 0.1,
      },
      {
        key: "horizonYears",
        label: "Analysis Horizon (years)",
        type: "number",
      },
      {
        key: "paybackBasis",
        label: "Payback Basis",
        type: "select",
        options: PAYBACK_BASIS_OPTIONS,
      },
    ],
  },
];

const SiteParametersForm: React.FC<SiteParametersFormProps> = ({
  parameters,
  onChange,
  onValidityChange,
}) => {
  const [errors, setErrors] = useState<SiteParametersFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SiteParametersFormValues, boolean>>
  >({});

  useEffect(() => {
    const result = siteParametersSchema.safeParse(parameters);

    if (result.success) {
      setErrors({});
      onValidityChange?.(true);
      return;
    }

    const nextErrors: SiteParametersFormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof SiteParametersFormValues;
      if (!nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    });
    setErrors(nextErrors);
    onValidityChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  const markTouched = (key: keyof SiteParametersFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleFieldChange = (
    key: keyof SiteParametersFormValues,
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
          title="Site & Solar Parameters"
          description="These parameters are used to optimize system sizing, financial
          projections, and performance calculations"
        />
      </div>

      {FIELD_GROUPS.map((group, groupIndex) => (
        <div
          key={group.title}
          className={`px-6 py-5 ${
            groupIndex > 0 || true ? "border-t border-[#E7E9E8]" : ""
          }`}
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

export default SiteParametersForm;
