declare const self: WorkerGlobalScope & {
  __WB_DISABLE_DEV_LOGS: boolean;
};

/**
 * Disables Serwist's logging in development mode.
 */
export const disableDevLogs = () => {
  self.__WB_DISABLE_DEV_LOGS = true;
};
