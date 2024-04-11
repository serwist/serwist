---
"@serwist/google-analytics": major
"@serwist/recipes": major
"serwist": major
---

refactor(core): replaced `PrecacheController` and `Router` with `Serwist`

- `PrecacheController` and `Router` have been moved to `serwist/legacy`. Their functionalities have been merged into the `Serwist` class. 

- The new `Serwist` class does NOT have a singleton instance. As such, `serwist/plugins.initializeGoogleAnalytics()` and `@serwist/recipes`'s functions now require you to pass in your own `Serwist` instance.

- This was done because separating Serwist's functionalities into three separate classes, namely `PrecacheController`, `Router`, and `Serwist`, was not only unnecessary, but it also required the code to be rather... boilerplatey. In the past, to set up, you needed to install all the necessary packages (`workbox-routing`, `workbox-precaching`, `workbox-strategies`), import all the necessary classes (`PrecacheController`, `Router`,...), and know all the APIs needed (`PrecacheController.precache`, `Router.registerRoute`, `new PrecacheRoute()`, runtime caching strategies,...) to get yourself started. To simplify that whole process, the Workbox team provided GenerateSW, which allowed you to create a service worker without having to write one. However, this design was not my cup of tea, one of the reasons of which was that you needed to migrate from GenerateSW to InjectManifest if you needed to do anything remotely complex, so I replaced it with `installSerwist`. Still, I was not satisfied by the result. I wanted an API where things are simple enough that you don't need to have multiple ways of doing one same thing, some more straightforward than others. This change where we merge the three classes is an effort to simplify and unify the API.

- To migrate, either:

    - Use the new `Serwist` class:
    
    ```ts
    import { Serwist } from "serwist";

    const serwist = new Serwist({
      // Initial list of precache entries.
      precacheEntries: [],
      // Initial list of runtime caching strategies.
      runtimeCaching: [],
    });

    // Additionally append another list of precache entries.
    // Make sure there are no duplicates in the initial list.
    serwist.addToPrecacheList([]);

    // Register another runtime caching strategy.
    serwist.registerRoute(
      new Route(
        /\/api\/.*\/*.json/,
        new NetworkOnly(),
        "POST",
      ),
    );

    // This should be called before `Serwist.addEventListeners`.
    self.addEventListener("message", (event) => {
      if (event.data && event.data.type === "YOUR_MESSAGE_TYPE") {
        // Do something
      }
    });

    // Finally, add Serwist's listeners.
    serwist.addEventListeners();
    ```

    - Or import `PrecacheController` and `Router` from `serwist/legacy`:

    ```ts
    import { PrecacheController, Router } from "serwist/legacy";
    ```
