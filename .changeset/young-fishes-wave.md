---
"@serwist/sw": minor
---

feat(sw): added `Serwist`

- This class will replace `installSerwist`, which will be deprecated in v9.0.0.

- To migrate:

    - Old:
    ```ts
    self.__WB_CONCURRENT_PRECACHING = 10;
    
    installSerwist({
      precacheEntries: getPrecacheManifest({
        // IMPORTANT NOTE: BUMP THIS UP SHOULD YOU CHANGE
        // (NOT ADD!) A FILE IN THE STATIC DIRECTORY.
        staticRevisions: "serwist-docs-static-v2",
        manifestTransforms: [
          (manifestEntries) => ({
            manifest: manifestEntries.filter((entry) => {
              // These files are not needed by the user.
              return !(
                entry.url.startsWith(`${basePath}/og/`) ||
                // These two files are only used by the prerenderer's `fetch`, so
                // we need not cache them.
                entry.url === `${basePath}/noto-sans-mono.ttf` ||
                entry.url === `${basePath}/yoga.wasm`
              );
            }),
          }),
        ],
      }),
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
      precacheEntries: getPrecacheManifest({
        // IMPORTANT NOTE: BUMP THIS UP SHOULD YOU CHANGE
        // (NOT ADD!) A FILE IN THE STATIC DIRECTORY.
        staticRevisions: "serwist-docs-static-v2",
        manifestTransforms: [
          (manifestEntries) => ({
            manifest: manifestEntries.filter((entry) => {
              // These files are not needed by the user.
              return !(
                entry.url.startsWith(`${basePath}/og/`) ||
                // These two files are only used by the prerenderer's `fetch`, so
                // we need not cache them.
                entry.url === `${basePath}/noto-sans-mono.ttf` ||
                entry.url === `${basePath}/yoga.wasm`
              );
            }),
          }),
        ],
      }),
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