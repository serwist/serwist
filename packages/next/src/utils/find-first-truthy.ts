/**
 * Find the first truthy value in an array.
 * @param arr
 * @param fn
 * @returns
 */
export const findFirstTruthy = <T, U>(arr: T[], fn: (elm: T) => U) => {
  for (const i of arr) {
    const resolved = fn(i);
    if (resolved) {
      return resolved;
    }
  }
  return undefined;
};
