const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <span className="font-medium text-slate-700">{d.name}</span>:{" "}
      <span className="text-slate-500">{d.value}%</span>
    </div>
  );
};

export default PieTooltip;
