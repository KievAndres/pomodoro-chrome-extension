export const convertMillisecondsIntoMinutes = (milliseconds: number): number => {
  return Math.floor(milliseconds / (60 * 1000));
};
