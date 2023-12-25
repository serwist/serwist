import path from "node:path";

import { DEV_READY_NAME, DEV_REGISTER_SW_NAME, DEV_SW_VIRTUAL, FILE_SW_REGISTER } from "./constants.js";
import type { ResolvedPluginOptions } from "./types.js";

export const generateSimpleSwRegister = (options: ResolvedPluginOptions, dev: boolean) => {
  const swPath = path.posix.join("/", options.buildBase, options.swUrl);

  // we are using HMR to load this script: DO NOT ADD window::load event listener
  if (dev) {
    const swType = options.devOptions.type ?? "classic";
    return `if('serviceWorker' in navigator) navigator.serviceWorker.register('${swPath}', { scope: '${options.scope}', type: '${swType}' })`;
  }

  return `if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('${swPath}', { scope: '${options.scope}' })
  })
}`.replace(/\n/g, "");
};

export const injectServiceWorker = (html: string, options: ResolvedPluginOptions, dev: boolean) => {
  const manifest = generateWebManifest(options, dev);

  if (!dev) {
    const script = generateRegisterSw(options, dev);
    if (script) {
      return html.replace("</head>", `${manifest}${script}</head>`);
    }
  }

  return html.replace("</head>", `${manifest}</head>`);
};

export const generateWebManifest = (options: ResolvedPluginOptions, dev: boolean) => {
  const crossorigin = options.useCredentials ? ' crossorigin="use-credentials"' : "";
  if (dev) {
    const name = `${options.base}${options.manifestFilename}`;
    return options.manifest ? `<link rel="manifest" href="${name}"${crossorigin}>` : "";
  } else {
    return options.manifest ? `<link rel="manifest" href="${options.buildBase}${options.manifestFilename}"${crossorigin}>` : "";
  }
};

export const generateRegisterSw = (options: ResolvedPluginOptions, dev: boolean) => {
  if (options.injectRegister === "inline") {
    return `<script id="vite-plugin-pwa:inline-sw">${generateSimpleSwRegister(options, dev)}</script>`;
  } else if (options.injectRegister === "script" || options.injectRegister === "script-defer") {
    const hasDefer = options.injectRegister === "script-defer";
    return `<script id="vite-plugin-pwa:register-sw" src="${dev ? options.base : options.buildBase}${FILE_SW_REGISTER}"${
      hasDefer ? " defer" : ""
    }></script>`;
  }

  return undefined;
};

export const generateRegisterDevSw = (base: string) => {
  const path = `${base.endsWith("/") ? base : `${base}/`}${DEV_SW_VIRTUAL.slice(1)}`;
  return `<script id="vite-plugin-pwa:register-dev-sw" type="module">
import registerDevSW from '${path}';
registerDevSW();
</script>`;
};

export const generateSwHmr = () => {
  // defer attribute: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
  return `
import.meta.hot.on('${DEV_REGISTER_SW_NAME}', ({ mode, inlinePath, registerPath, scope, swType = 'classic' }) => {
  if (mode == 'inline') {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register(inlinePath, { scope, type: swType });
    }
  }
  else {
    const registerSW = document.createElement('script');
    registerSW.setAttribute('id', 'vite-plugin-pwa:register-sw');
    if (mode === 'script-defer') registerSW.setAttribute('defer', 'defer');
    registerSW.setAttribute('src', registerPath);
    document.head.appendChild(registerSW);
  }
});
function registerDevSw() {
  try {
    import.meta.hot.send('${DEV_READY_NAME}');
  } catch (e) {
    console.error('unable to send ${DEV_READY_NAME} message to register service worker in dev mode!', e);
  }
}
export default registerDevSw;
`;
};
