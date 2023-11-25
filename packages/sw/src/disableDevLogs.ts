declare const self: WorkerGlobalScope & {
    __WB_DISABLE_DEV_LOGS: boolean;
};

export const disableDevLogs = () => {
    self.__WB_DISABLE_DEV_LOGS = true;
}