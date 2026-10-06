/**
 * Normalised diurnal cooling load shape (0 at the overnight minimum, 1 at the
 * afternoon peak), indexed by hour of day with its peak at hour 12.
 */
const DIURNAL_SHAPE = [
  0, 0, 0, 0, 0, 0.0532, 0.1277, 0.2766, 0.5106, 0.6915, 0.8723, 0.9574, 1,
  0.9681, 0.9362, 0.8404, 0.6702, 0.4787, 0.3298, 0.2128, 0.1277, 0.0638,
  0.0213, 0,
];

const SHAPE_PEAK_HOUR = 12;

export interface CoolingLoadProfileInput {
  peakCoolingLoadKw: number;
  baseCoolingLoadKw: number;
  peakHour: number;
}

/**
 * Expands three scalar inputs into the 24-hour profile the solve endpoint
 * expects, by scaling the diurnal shape between the base and peak loads and
 * rotating it so its maximum lands on the chosen peak hour.
 */
export const buildCoolingLoadProfile = ({
  peakCoolingLoadKw,
  baseCoolingLoadKw,
  peakHour,
}: CoolingLoadProfileInput): Record<string, number> => {
  const swing = peakCoolingLoadKw - baseCoolingLoadKw;
  const shift = peakHour - SHAPE_PEAK_HOUR;

  const profile: Record<string, number> = {};
  for (let hour = 0; hour < 24; hour += 1) {
    const shapeIndex = (((hour - shift) % 24) + 24) % 24;
    const load = baseCoolingLoadKw + swing * DIURNAL_SHAPE[shapeIndex];
    profile[String(hour)] = Math.round(load * 10) / 10;
  }

  return profile;
};

export interface CoolingLoadProfilePoint {
  hour: string;
  loadKw: number;
}

export const toCoolingLoadProfilePoints = (
  profile: Record<string, number>,
): CoolingLoadProfilePoint[] =>
  Object.keys(profile)
    .map(Number)
    .sort((a, b) => a - b)
    .map((hour) => ({
      hour: `${String(hour).padStart(2, "0")}:00`,
      loadKw: profile[String(hour)],
    }));
