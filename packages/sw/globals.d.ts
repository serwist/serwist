declare global {
  interface WorkerGlobalScope {
    __WB_FORCE_RUNTIME_CACHING: boolean;
  }
}

export {};
