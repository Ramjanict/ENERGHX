import CommonSelect, { SelectOption } from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import {
  BatterySiteParametersFormErrors,
  BatterySiteParametersFormValues,
  batterySiteParametersSchema,
  TouWindowErrors,
  TouWindowFormValues,
} from "@/store/consumer/standard/designs/battery/schema/siteParametersSchema";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface BatterySiteParametersFormProps {
  parameters: BatterySiteParametersFormValues;
  onChange: (parameters: BatterySiteParametersFormValues) => void;
  onValidityChange?: (isValid: boolean) => void;
}

type FieldType = "number" | "select";

type EditableFieldKey = Exclude<
  keyof BatterySiteParametersFormValues,
  "touWindows" | "loadProfile"
>;

interface FieldConfig {
  key: EditableFieldKey;
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

const SIZING_MODE_OPTIONS: readonly SelectOption<string>[] = [
  { value: "as-selected", label: "As selected" },
];

const OPTIMIZE_FOR_OPTIONS: readonly SelectOption<string>[] = [
  { value: "self_sufficiency", label: "Self sufficiency" },
];

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Load & Backup",
    fields: [
      {
        key: "annualLoadKwh",
        label: "Annual Load (kWh)",
        type: "number",
        helperText: "Total yearly site electricity consumption",
      },
      {
        key: "peakDemandKw",
        label: "Peak Demand (kW)",
        type: "number",
        step: 0.1,
        helperText: "Highest expected site demand",
      },
      {
        key: "backupLoadsKw",
        label: "Backup Loads (kW)",
        type: "number",
        step: 0.1,
        helperText: "Critical load the battery must carry",
      },
      {
        key: "targetBackupHours",
        label: "Target Backup (hours)",
        type: "number",
        step: 0.5,
        helperText: "How long those loads must run off-grid",
      },
      {
        key: "sizingMode",
        label: "Sizing Mode",
        type: "select",
        options: SIZING_MODE_OPTIONS,
      },
      {
        key: "optimizeFor",
        label: "Optimize For",
        type: "select",
        options: OPTIMIZE_FOR_OPTIONS,
      },
    ],
  },
  {
    title: "Tariff",
    fields: [
      {
        key: "importRate",
        label: "Import Rate",
        type: "number",
        step: 0.01,
        helperText: "Cost per kWh drawn from the grid",
      },
      {
        key: "exportRate",
        label: "Export Rate",
        type: "number",
        step: 0.01,
        helperText: "Credit per kWh exported to the grid",
      },
      {
        key: "demandChargePerKw",
        label: "Demand Charge ($/kW)",
        type: "number",
        step: 0.01,
        helperText: "Monthly demand charge per kW",
      },
    ],
  },
];

const NEW_TOU_WINDOW: TouWindowFormValues = {
  start: "23:00",
  end: "07:00",
  rate: 0.08,
};

const BatterySiteParametersForm: React.FC<BatterySiteParametersFormProps> = ({
  parameters,
  onChange,
  onValidityChange,
}) => {
  const [errors, setErrors] = useState<BatterySiteParametersFormErrors>({});
  const [windowErrors, setWindowErrors] = useState<TouWindowErrors[]>([]);
  const [touched, setTouched] = useState<
    Partial<Record<keyof BatterySiteParametersFormValues, boolean>>
  >({});
  const [touWindowsTouched, setTouWindowsTouched] = useState(false);

  // Re-validate whenever parameters change (user edits or parent-driven resets)
  useEffect(() => {
    const result = batterySiteParametersSchema.safeParse(parameters);

    if (result.success) {
      setErrors({});
      setWindowErrors([]);
      onValidityChange?.(true);
      return;
    }

    const nextErrors: BatterySiteParametersFormErrors = {};
    const nextWindowErrors: TouWindowErrors[] = [];

    result.error.issues.forEach((issue) => {
      const [field, index, subField] = issue.path;

      if (field === "touWindows" && typeof index === "number") {
        const rowErrors = nextWindowErrors[index] ?? {};
        rowErrors[subField as keyof TouWindowFormValues] = issue.message;
        nextWindowErrors[index] = rowErrors;
        return;
      }

      const key = field as keyof BatterySiteParametersFormErrors;
      if (!nextErrors[key]) nextErrors[key] = issue.message;
    });

    setErrors(nextErrors);
    setWindowErrors(nextWindowErrors);
    onValidityChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  const markTouched = (key: keyof BatterySiteParametersFormValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleFieldChange = (key: EditableFieldKey, rawValue: string) => {
    markTouched(key);
    onChange({
      ...parameters,
      [key]: rawValue === "" ? 0 : parseFloat(rawValue),
    });
  };

  const updateWindow = (
    index: number,
    patch: Partial<TouWindowFormValues>,
  ) => {
    setTouWindowsTouched(true);
    onChange({
      ...parameters,
      touWindows: parameters.touWindows.map((window, i) =>
        i === index ? { ...window, ...patch } : window,
      ),
    });
  };

  const addWindow = () => {
    setTouWindowsTouched(true);
    onChange({
      ...parameters,
      touWindows: [...parameters.touWindows, { ...NEW_TOU_WINDOW }],
    });
  };

  const removeWindow = (index: number) => {
    setTouWindowsTouched(true);
    onChange({
      ...parameters,
      touWindows: parameters.touWindows.filter((_, i) => i !== index),
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
          title="Load, Backup & Tariff Parameters"
          description="These parameters drive battery sizing, dispatch modelling and the
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
                        onChange({
                          ...parameters,
                          [field.key]: val as BatterySiteParametersFormValues[EditableFieldKey],
                        });
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
                      value={value as number}
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-[#112518]">
              Time-of-Use Windows
            </h4>
            <p className="text-xs text-[#758179] mt-1">
              Off-peak periods the battery can charge in, each with its own rate.
              Leave empty to price all imports at the standard rate.
            </p>
          </div>

          <button
            type="button"
            onClick={addWindow}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border border-primary text-primary hover:bg-[#EAF7E6]/60 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Window
          </button>
        </div>

        {parameters.touWindows.length === 0 ? (
          <p className="text-sm text-[#758179] py-4 text-center border border-dashed border-[#E7E9E8] rounded-xl">
            No time-of-use windows configured.
          </p>
        ) : (
          <div className="space-y-3">
            {parameters.touWindows.map((window, index) => {
              const rowErrors = touWindowsTouched
                ? windowErrors[index]
                : undefined;

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-x-4 gap-y-3 items-start border border-[#E7E9E8] rounded-xl p-4"
                >
                  <div>
                    <label className={inputClass.label}>Start</label>
                    <input
                      type="time"
                      value={window.start}
                      onChange={(e) =>
                        updateWindow(index, { start: e.target.value })
                      }
                      className={`${inputClass.input} ${
                        rowErrors?.start ? "border-red-500" : ""
                      }`}
                    />
                    {rowErrors?.start && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {rowErrors.start}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={inputClass.label}>End</label>
                    <input
                      type="time"
                      value={window.end}
                      onChange={(e) =>
                        updateWindow(index, { end: e.target.value })
                      }
                      className={`${inputClass.input} ${
                        rowErrors?.end ? "border-red-500" : ""
                      }`}
                    />
                    {rowErrors?.end && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {rowErrors.end}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={inputClass.label}>Rate per kWh</label>
                    <input
                      type="number"
                      step={0.01}
                      value={window.rate}
                      onChange={(e) =>
                        updateWindow(index, {
                          rate:
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value),
                        })
                      }
                      className={`${inputClass.input} ${
                        rowErrors?.rate ? "border-red-500" : ""
                      }`}
                    />
                    {rowErrors?.rate && (
                      <p className="text-xs text-red-600 mt-1.5">
                        {rowErrors.rate}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeWindow(index)}
                    aria-label={`Remove window ${index + 1}`}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 sm:mt-6 text-sm font-medium rounded-lg border border-[#E7E9E8] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden">Remove</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatterySiteParametersForm;
