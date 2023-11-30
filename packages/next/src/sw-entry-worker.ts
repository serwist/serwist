declare const self: WorkerGlobalScope & typeof globalThis;

export type MessageType =
  | {
      type: "__FRONTEND_NAV_CACHE__";
      url: URL | string;
    }
  | {
      type: "__START_URL_CACHE__";
      url: URL | string;
    };

self.onmessage = async (ev: MessageEvent<MessageType>) => {
  switch (ev.data.type) {
    case "__START_URL_CACHE__": {
      const url = ev.data.url;
      const response = await fetch(url);
      if (!response.redirected) {
        const startUrlCache = await caches.open("start-url");
        return startUrlCache.put(url, response);
      }
      return Promise.resolve();
    }
    case "__FRONTEND_NAV_CACHE__": {
      const url = ev.data.url;
      const pagesCache = await caches.open("pages");

      const isPageCached = !!(await pagesCache.match(url, {
        ignoreSearch: true,
      }));
      if (isPageCached) {
        return;
      }

      const page = await fetch(url);
      if (!page.ok) {
        return;
      }
      pagesCache.put(url, page.clone());

      return Promise.resolve();
    }
    default:
      return Promise.resolve();
  }
};
