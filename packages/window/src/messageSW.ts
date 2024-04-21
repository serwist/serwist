/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

/**
 * Sends a data object to a service worker via `postMessage` and resolves with
 * a response (if any).
 *
 * A response can be sent by calling `event.ports[0].postMessage(...)`, which will
 * resolve the promise returned by `messageSW()`. If no response is sent, the promise
 * will never resolve.
 *
 * @param sw The service worker to send the message to.
 * @param data An object to send to the service worker.
 * @returns
 */
export const messageSW = (sw: ServiceWorker, data: any): Promise<any> => {
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event: MessageEvent) => {
      resolve(event.data);
    };
    sw.postMessage(data, [messageChannel.port2]);
  });
};
