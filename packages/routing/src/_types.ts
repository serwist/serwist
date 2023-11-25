/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/


// * * * IMPORTANT! * * *
// ------------------------------------------------------------------------- //
// jdsoc type definitions cannot be declared above TypeScript definitions or
// they'll be stripped from the built `.js` files, and they'll only be in the
// `d.ts` files, which aren't read by the jsdoc generator. As a result we
// have to put declare them below.

/**
 * The "match" callback is used to determine if a `Route` should apply for a
 * particular URL. When matching occurs in response to a fetch event from the
 * client, the `event` object is supplied in addition to the `url`, `request`,
 * and `sameOrigin` value. However, since the match callback can be invoked
 * outside of a fetch event, matching logic should not assume the `event`
 * object will always be available.
 *
 * If the match callback returns a truthy value, the matching route's
 * {@link workbox-routing~handlerCallback} will be
 * invoked immediately. If the value returned is a non-empty array or object,
 * that value will be set on the handler's `context.params` argument.
 *
 * @callback ~matchCallback
 * @param context
 * @param context.request The corresponding request.
 * @param context.url The request's URL.
 * @param context.event The corresponding event that triggered
 *     the request.
 * @param context.sameOrigin The result of comparing `url.origin`
 *     against the current origin.
 * @returns To signify a match, return a truthy value.
 */

/**
 * The "handler" callback is invoked whenever a `Router` matches a URL to a
 * `Route` via its {@link workbox-routing~matchCallback}
 * callback. This callback should return a Promise that resolves with a
 * `Response`.
 *
 * If a non-empty array or object is returned by the
 * {@link workbox-routing~matchCallback} it
 * will be passed in as the handler's `context.params` argument.
 *
 * @callback ~handlerCallback
 * @param context
 * @param context.request The corresponding request.
 * @param context.url The URL that matched, if available.
 * @param context.event The corresponding event that triggered
 *     the request.
 * @param context.params Array or Object parameters returned by the
 *     Route's {@link workbox-routing~matchCallback}.
 *     This will be undefined if an empty array or object were returned.
 * @returns The response that will fulfill the request.
 *
 * @memberof workbox-routing
 */
