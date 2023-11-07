export interface Config {
  /**
   * If true, `dev` builds are using, otherwise
   * `prod` builds are used. By default, `prod` is used unless on localhost.
   */
  debug?: Boolean;
  /**
   * To avoid using the CDN with
   * `@serwist/sw` set the path prefix of where modules should be loaded from.
   * For example `modulePathPrefix: '/third_party/workbox/v3.0.0/'`.
   */
  modulePathPrefix?: String;
  /**
   * If defined,
   * this callback will be responsible for determining the path of each
   * workbox module.
   */
  modulePathCb?: any;
}
