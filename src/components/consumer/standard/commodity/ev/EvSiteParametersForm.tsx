import CommonSelect, { SelectOption } from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import {
  EvSiteParametersFormErrors,
  EvSiteParametersFormValues,
  evSiteParametersSchema,
} from "@/store/consumer/standard/designs/ev/schema/siteParametersSchema";
import { useEffect, useState } from "react";

interface EvSiteParametersFormProps {
  parameters: EvSiteParametersFormValues;
  onChange: (parameters: EvSiteParametersFormValues) => void;
  onValidityChange?: (isValid: boolean) => void;
}

type FieldType = "number" | "text" | "select";

interface FieldConfig {
  key: keyof EvSiteParametersFormValues;
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

const DISTANCE_UNIT_OPTIONS: readonly SelectOption<string>[] = [
  { value: "km", label: "Kilometres (km)" },
  { value: "mi", label: "Miles (mi)" },
];

const SIZING_MODE_OPTIONS: readonly SelectOption<string>[] = [
  { value: "size-to-fleet", label: "Size to fleet demand" },
];

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Site & Grid Capacity",
    fields: [
      {
        key: "annualLoadKwh",
        label: "Annual Site Load (kWh)",
        type: "number",
        helperText: "Existing yearly electricity consumption for the site",
      },
      {
        key: "gridConnectionKw",
        label: "Grid Connection (kW)",
        type: "number",
        helperText: "Rated capacity of the incoming service",
      },
      {
        key: "existingPeakDemandKw",
        label: "Existing Peak Demand (kW)",
        type: "number",
        helperText: "Headroom left for charging is the difference",
      },
    ],
  },
  {
    title: "Fleet Profile",
    fields: [
      {
        key: "vehicleCount",
        label: "Vehicle Count",
        type: "number",
      },
      {
        key: "averageDailyDistance",
        label: "Average Daily Distance",
        type: "number",
        helperText: "Per vehicle, in the unit selected below",
      },
      {
        key: "distanceUnit",
        label: "Distance Unit",
        type: "select",
        options: DISTANCE_UNIT_OPTIONS,
      },
      {
        key: "consumptionKwhPer100",
        label: "Consumption (kWh per 100)",
        type: "number",
        step: 0.1,
        helperText: "Energy used per 100 km or miles travelled",
      },
      {
        key: "targetUptimePercent",
        label: "Target Uptime (%)",
        type: "number",
        helperText: "Availability the charging fleet must sustain",
      },
    ],
  },
  {
    title: "Tariff & Sizing Options",
    fields: [
      {
        key: "energyRate",
        label: "Energy Rate",
        type: "number",
        step: 0.01,
        helperText: "Cost per kWh drawn from the grid",
      },
      {
        key: "demandChargePerKw",
        label: "Demand Charge (per kW)",
        type: "number",
        step: 0.5,
        helperText: "Monthly charge applied to billed peak demand",
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

const EvSiteParametersForm: React.FC<EvSiteParametersFormProps> = ({
  parameters,
  onChange,
  onValidityChange,
}) => {
  const [errors, setErrors] = useState<EvSiteParametersFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof EvSiteParametersFormValues, boolean>>
  >({});

  // Re-validate whenever parameters change (user edits or parent-driven resets)
  useEffect(() => {
    const result = evSiteParametersSchema.safeParse(parameters);

    if (result.success) {
      setErrors({});
      onValidityChange?.(true);
      return;
    }

    const nextErrors: EvSiteParametersFormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof EvSiteParametersFormValues;
      if (!nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    });
    setErrors(nextErrors);
    onValidityChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  const markTouched = (key: keyof EvSiteParametersFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleFieldChange = (
    key: keyof EvSiteParametersFormValues,
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
          title="Site, Fleet & Charging Parameters"
          description="These parameters are used to size the charging infrastructure,
          model energy delivery, and project operating costs"
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

export default EvSiteParametersForm;
