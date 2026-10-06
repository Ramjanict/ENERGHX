export const loadingList = new Array(4).fill(null);

export const capitalize = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatMetric = (value: number, unit: string = "") => {
  return `${value.toFixed(3)}${unit ? " " + unit : ""}`;
};
