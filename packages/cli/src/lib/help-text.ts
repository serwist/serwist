/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

export const helpText = `Usage:
$ serwist <command> [options]

Commands:
  wizard
    Runs the configuration wizard, which will generate a
    config file based on answers to questions.

  inject-manifest [<path/to/config.js>] [--watch]
    Takes an existing service worker file and creates a
    copy of it with a precache manifest injected. The precache 
    manifest is generated based on the options in the config file 
    (defaults to 'serwist.config.js'). If '--watch' is provided, the 
    CLI will stay running and rebuild the service worker each 
    time a file in the precache manifest changes. See 
    https://serwist.pages.dev/docs/cli for more information.

Configuration file:
  The 'inject-manifest' command expects the configuration 
  file to be a JavaScript file. By default, it is assumed 
  to be named 'serwist.config.js' and located in the current
  directory, but this can be overridden.

Examples:
  $ serwist wizard
  $ serwist inject-manifest configs/serwist-config.js
`;
