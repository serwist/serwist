/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

export const helpText = `Usage:
$ serwist <command> [options]

Commands:
  wizard [--injectManifest]
    Runs the configuration wizard, which will generate a
    config file based on answers to questions.

  injectManifest [<path/to/config.js>] [--watch]
    Takes an existing service worker file and creates a
    copy of it with a precache manifest "injected" into
    it. The precache manifest is generated based on the
    options in the config file (defaults to serwist.config.js).
    If --watch is provided, the CLI will stay running, and will
    rebuild the service worker each time a file in the precache
    manifest changes.
    See https://bit.ly/wb-injectManifest

  copyLibraries <path/to/parent/dir>
    Makes a local copy of all of the Workbox libraries inside
    a version directory at the location specified. This is intended
    for developers using injectManifest who prefer using local,
    rather than CDN hosted, libraries.

Config file:
  In 'injectManifest' mode, the config file should be a
  JavaScript file, in CommonJS module format.
  By default, a config file named serwist.config.js in the current
  directory is assumed, but this can be overridden.

Examples:
  $ serwist wizard
  $ serwist wizard --injectManifest
  $ serwist injectManifest configs/serwist-dev-config.js
  $ serwist copyLibraries build/
`;
