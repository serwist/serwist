/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
export { cacheNames, copyResponse, registerQuotaErrorCallback, setCacheNameDetails } from "serwist";
export { clientsClaim } from "serwist/internal";
export type {
  PromiseOrNot,
  MapLikeObject,
  PluginState,
  RouteMatchCallbackOptions,
  RouteMatchCallback,
  RouteHandlerCallbackOptions,
  ManualHandlerCallbackOptions,
  HandlerCallbackOptions,
  RouteHandlerCallback,
  ManualHandlerCallback,
  RouteHandlerObject,
  RouteHandler,
  HandlerWillStartCallbackParam,
  HandlerWillStartCallback,
  CacheDidUpdateCallbackParam,
  CacheDidUpdateCallback,
  CacheKeyWillBeUsedCallbackParam,
  CacheKeyWillBeUsedCallback,
  CacheWillUpdateCallbackParam,
  CacheWillUpdateCallback,
  CachedResponseWillBeUsedCallbackParam,
  CachedResponseWillBeUsedCallback,
  FetchDidFailCallbackParam,
  FetchDidFailCallback,
  FetchDidSucceedCallbackParam,
  FetchDidSucceedCallback,
  RequestWillFetchCallbackParam,
  RequestWillFetchCallback,
  HandlerWillRespondCallbackParam,
  HandlerWillRespondCallback,
  HandlerDidErrorCallbackParam,
  HandlerDidErrorCallback,
  HandlerDidRespondCallbackParam,
  HandlerDidRespondCallback,
  HandlerDidCompleteCallbackParam,
  HandlerDidCompleteCallback,
  SerwistPlugin,
  SerwistPluginCallbackParam,
  SerwistGlobalConfig,
} from "serwist";
