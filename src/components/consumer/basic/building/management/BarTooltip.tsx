const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md min-w-[140px] space-y-1">
      <div className="font-semibold text-slate-700 border-b border-slate-100 pb-1">{label}</div>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span>{entry.name || "Usage"}:</span>
          </div>
          <span className="font-bold text-slate-800">
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}{" "}
            kWh
          </span>
        </div>
      ))}
    </div>
  );
};

export default BarTooltip;
