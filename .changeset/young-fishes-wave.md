---
"@serwist/sw": minor
---

feat(sw): added `Serwist`

- This class will replace `installSerwist`, which will be deprecated in v9.0.0.

- To migrate:

    - Old:
    ```ts    
    installSerwist({
      precacheEntries: self.__SW_MANIFEST,
      precacheOptions: {
        ignoreURLParametersMatching: defaultIgnoreUrlParameters,
      },
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      navigationPreload: false,
      disableDevLogs: true,
      runtimeCaching: defaultCache,
    });
    ```

    - New: 
    ```ts
    const serwist = new Serwist({
      precacheController: new PrecacheController({
        concurrentPrecaching: 10,
      }),
    });

    serwist.install({
      precacheEntries: self.__SW_MANIFEST,
      precacheOptions: {
        ignoreURLParametersMatching: defaultIgnoreUrlParameters,
      },
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      navigationPreload: false,
      disableDevLogs: true,
      runtimeCaching: defaultCache,
    });
    ```