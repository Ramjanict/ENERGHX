import CommonSelect, { SelectOption } from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import {
  BiomassSiteParametersFormErrors,
  BiomassSiteParametersFormValues,
  biomassSiteParametersSchema,
} from "@/store/consumer/standard/designs/biomass/schema/siteParametersSchema";
import { useEffect, useState } from "react";

interface BiomassSiteParametersFormProps {
  parameters: BiomassSiteParametersFormValues;
  onChange: (parameters: BiomassSiteParametersFormValues) => void;
  onValidityChange?: (isValid: boolean) => void;
}

type FieldType = "number" | "text" | "select";

interface FieldConfig {
  key: keyof BiomassSiteParametersFormValues;
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

const FEEDSTOCK_AVAILABILITY_OPTIONS: readonly SelectOption<string>[] = [
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
];

const FEEDSTOCK_OPTIONS: readonly SelectOption<string>[] = [
  { value: "Cattle dung", label: "Cattle dung" },
  { value: "Wood chips", label: "Wood chips" },
  { value: "Wood pellets", label: "Wood pellets" },
  { value: "Split logs", label: "Split logs" },
  { value: "Agricultural residue", label: "Agricultural residue" },
  { value: "Mixed biomass", label: "Mixed biomass" },
];

const USAGE_PROFILE_OPTIONS: readonly SelectOption<string>[] = [
  { value: "intermittent", label: "Intermittent" },
  { value: "continuous", label: "Continuous" },
  { value: "daytime_home", label: "Daytime home" },
  { value: "seasonal", label: "Seasonal" },
];

const INCUMBENT_FUEL_OPTIONS: readonly SelectOption<string>[] = [
  { value: "Heating oil", label: "Heating oil" },
  { value: "Natural gas", label: "Natural gas" },
  { value: "LPG", label: "LPG" },
  { value: "Diesel", label: "Diesel" },
  { value: "Electricity", label: "Electricity" },
];

const SAVINGS_BASIS_OPTIONS: readonly SelectOption<string>[] = [
  { value: "gross", label: "Gross (before incentives)" },
  { value: "net", label: "Net (after incentives)" },
];

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Site & Feedstock Context",
    fields: [
      {
        key: "locationLabel",
        label: "Site Location",
        type: "text",
        helperText: 'Used for feedstock sourcing, e.g. "Lagos, Nigeria"',
      },
      {
        key: "currency",
        label: "Currency",
        type: "select",
        options: CURRENCY_OPTIONS,
      },
      {
        key: "feedstockAvailability",
        label: "Local Feedstock Availability",
        type: "select",
        options: FEEDSTOCK_AVAILABILITY_OPTIONS,
      },
      {
        key: "feedstock",
        label: "Feedstock",
        type: "select",
        options: FEEDSTOCK_OPTIONS,
      },
      {
        key: "environmentTemperatureC",
        label: "Environment Temperature (°C)",
        type: "number",
        step: 0.5,
      },
      {
        key: "slurryFeedstockKg",
        label: "Slurry Feedstock (kg)",
        type: "number",
        step: 0.1,
        helperText: "Feedstock part of the slurry mixture ratio",
      },
      {
        key: "slurryWaterKg",
        label: "Slurry Water (kg)",
        type: "number",
        step: 0.1,
        helperText: "Water part of the slurry mixture ratio",
      },
      {
        key: "heatingSeasonMonths",
        label: "Heating Season (months)",
        type: "number",
      },
      {
        key: "heatingDemandKwhPerYear",
        label: "Annual Heating Demand (kWh)",
        type: "number",
        helperText: "Total yearly thermal demand for this site",
      },
      {
        key: "annualLoadKwh",
        label: "Annual Electrical Load (kWh)",
        type: "number",
      },
      {
        key: "usageProfile",
        label: "Usage Profile",
        type: "select",
        options: USAGE_PROFILE_OPTIONS,
      },
    ],
  },
  {
    title: "Fuel Parameters",
    fields: [
      {
        key: "fuelCostPerTonne",
        label: "Fuel Cost (per tonne)",
        type: "number",
        step: 1,
      },
      {
        key: "energyDensityKwhPerKg",
        label: "Energy Density (kWh/kg)",
        type: "number",
        step: 0.1,
        helperText: "Wood pellets are typically 4.6–5.0 kWh/kg",
      },
      {
        key: "moistureContentPct",
        label: "Moisture Content (%)",
        type: "number",
        step: 0.5,
        helperText: "Lower moisture yields higher usable energy",
      },
    ],
  },
  {
    title: "Financial Parameters & Options",
    fields: [
      {
        key: "tariffRatePerKwhThermal",
        label: "Thermal Tariff Rate",
        type: "number",
        step: 0.01,
        helperText: "Cost per kWh thermal of the fuel being displaced",
      },
      {
        key: "incumbentFuel",
        label: "Incumbent Fuel",
        type: "select",
        options: INCUMBENT_FUEL_OPTIONS,
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
      {
        key: "storageMonths",
        label: "On-site Storage (months)",
        type: "number",
        step: 1,
        helperText: "Months of feedstock supply to store on site",
      },
    ],
  },
];

const BiomassSiteParametersForm: React.FC<BiomassSiteParametersFormProps> = ({
  parameters,
  onChange,
  onValidityChange,
}) => {
  const [errors, setErrors] = useState<BiomassSiteParametersFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof BiomassSiteParametersFormValues, boolean>>
  >({});

  // Re-validate whenever parameters change (user edits or parent-driven resets)
  useEffect(() => {
    const result = biomassSiteParametersSchema.safeParse(parameters);

    if (result.success) {
      setErrors({});
      onValidityChange?.(true);
      return;
    }

    const nextErrors: BiomassSiteParametersFormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof BiomassSiteParametersFormValues;
      if (!nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    });
    setErrors(nextErrors);
    onValidityChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  const markTouched = (key: keyof BiomassSiteParametersFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleFieldChange = (
    key: keyof BiomassSiteParametersFormValues,
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
          title="Site & Biomass Parameters"
          description="These parameters are used to optimize system sizing, feedstock
          analysis, and financial projections"
        />
      </div>

      {FIELD_GROUPS.map((group, groupIndex) => (
        <div key={group.title} className="px-6 py-5 border-t border-[#E7E9E8]">
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

export default BiomassSiteParametersForm;
