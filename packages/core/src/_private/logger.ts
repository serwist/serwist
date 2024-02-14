/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

// logger is used inside of both service workers and the window global scope.
declare global {
  interface WorkerGlobalScope {
    __WB_DISABLE_DEV_LOGS: boolean;
  }

  interface Window {
    __WB_DISABLE_DEV_LOGS: boolean;
  }
}

/**
 * The logger used by Serwist inside of both service workers and the window global scope.
 *
 * Note: This is forcibly `null` in production mode to reduce bundle size. Do check whether
 * you are currently in development mode (by using `process.env.NODE_ENV !== "production"`)
 * before using it.
 */
export const logger =
  process.env.NODE_ENV === "production"
    ? null!
    : (() => {
        // Don't overwrite this value if it's already set.
        // See https://github.com/GoogleChrome/workbox/pull/2284#issuecomment-560470923
        if (!("__WB_DISABLE_DEV_LOGS" in globalThis)) {
          self.__WB_DISABLE_DEV_LOGS = false;
        }

        let inGroup = false;

        const methodToColorMap = {
          debug: "#7f8c8d", // Gray
          log: "#2ecc71", // Green
          warn: "#f39c12", // Yellow
          error: "#c0392b", // Red
          groupCollapsed: "#3498db", // Blue
          groupEnd: null, // No colored prefix on groupEnd
        };

        type LoggerMethods = keyof typeof methodToColorMap;

        const print = (method: LoggerMethods, args: any[]) => {
          if (self.__WB_DISABLE_DEV_LOGS) {
            return;
          }

          if (method === "groupCollapsed") {
            // Safari doesn't print all console.groupCollapsed() arguments:
            // https://bugs.webkit.org/show_bug.cgi?id=182754
            if (typeof navigator !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
              console[method](...args);
              return;
            }
          }

          const styles = [
            `background: ${methodToColorMap[method]!}`,
            "border-radius: 0.5em",
            "color: white",
            "font-weight: bold",
            "padding: 2px 0.5em",
          ];

          // When in a group, the serwist prefix is not displayed.
          const logPrefix = inGroup ? [] : ["%cserwist", styles.join(";")];

          console[method](...logPrefix, ...args);

          if (method === "groupCollapsed") {
            inGroup = true;
          }
          if (method === "groupEnd") {
            inGroup = false;
          }
        };

        const loggerMethods = Object.keys(methodToColorMap) as LoggerMethods[];

        return loggerMethods.reduce(
          (api, method) => {
            api[method] = (...args: any[]) => {
              print(method, args);
            };
            return api;
          },
          {} as { [method in LoggerMethods]: (...args: any[]) => void },
        );
      })();
