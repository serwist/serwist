import { Serwist, type SerwistOptions } from "../Serwist.js";

/**
 * Options for `installSerwist`.
 *
 * @deprecated
 */
export type InstallSerwistOptions = SerwistOptions;

/**
 * Abstracts away the core APIs of Serwist.
 *
 * @param options - `installSerwist` options.
 * @deprecated
 */
export const installSerwist = (options: InstallSerwistOptions): void => {
  const serwist = new Serwist(options);
  serwist.addEventListeners();
};
