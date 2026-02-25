export const miToKm = (mi: number) => Math.round(mi * 1.60934);

export const mphToKmh = (mph: number) => Math.round(mph * 1.60934);

export const lbsToKg = (lbs: number) => Math.round(lbs * 0.45359237);

export const inchesToMm = (inches: number) => Math.round(inches * 25.4);

export const cuFtToL = (cuFt: number) => Math.round(cuFt * 28.3168);

export const whPerMiToWhPerKm = (whPerMi: number) =>
  Math.round(whPerMi / 1.60934);
