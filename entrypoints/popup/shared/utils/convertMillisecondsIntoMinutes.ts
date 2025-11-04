export const convertMillisecondsIntoMinutes = (milliseconds: number): number => {
  return Math.ceil(milliseconds / (60 * 1000));
};
