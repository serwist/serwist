/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

export type {
  CacheDidUpdateCallback,
  CacheDidUpdateCallbackParam,
  CachedResponseWillBeUsedCallback,
  CachedResponseWillBeUsedCallbackParam,
  CacheKeyWillBeUsedCallback,
  CacheKeyWillBeUsedCallbackParam,
  CacheWillUpdateCallback,
  CacheWillUpdateCallbackParam,
  FetchDidFailCallback,
  FetchDidFailCallbackParam,
  FetchDidSucceedCallback,
  FetchDidSucceedCallbackParam,
  HandlerCallbackOptions,
  HandlerDidCompleteCallback,
  HandlerDidCompleteCallbackParam,
  HandlerDidErrorCallback,
  HandlerDidErrorCallbackParam,
  HandlerDidRespondCallback,
  HandlerDidRespondCallbackParam,
  HandlerWillRespondCallback,
  HandlerWillRespondCallbackParam,
  HandlerWillStartCallback,
  HandlerWillStartCallbackParam,
  ManualHandlerCallback,
  ManualHandlerCallbackOptions,
  MapLikeObject,
  PluginState,
  PromiseOrNot,
  RequestWillFetchCallback,
  RequestWillFetchCallbackParam,
  RouteHandler,
  RouteHandlerCallback,
  RouteHandlerCallbackOptions,
  RouteHandlerObject,
  RouteMatchCallback,
  RouteMatchCallbackOptions,
  SerwistGlobalConfig,
  SerwistPlugin,
  SerwistPluginCallbackParam,
} from "serwist";
export { cacheNames, copyResponse, registerQuotaErrorCallback, setCacheNameDetails } from "serwist";
export { clientsClaim } from "serwist/internal";
