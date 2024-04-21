/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import { oneLine as ol } from "common-tags";

export const errors = {
  "unable-to-get-rootdir": "Unable to get the root directory of your web app.",
  "no-extension": ol`Unable to detect a usable extension for a file in your web
    app directory.`,
  "invalid-file-manifest-name": ol`The File Manifest Name must have at least one
    character.`,
  "unable-to-get-file-manifest-name": "Unable to get a file manifest name.",
  "invalid-sw-dest": `The 'swDest' value must be a valid path.`,
  "unable-to-get-sw-name": "Unable to get a service worker file name.",
  "unable-to-get-save-config": ol`An error occurred when asking to save details
    in a config file.`,
  "unable-to-get-file-hash": ol`An error occurred when attempting to create a
    file hash.`,
  "unable-to-get-file-size": ol`An error occurred when attempting to get a file
    size.`,
  "unable-to-glob-files": "An error occurred when globbing for files.",
  "unable-to-make-manifest-directory": ol`Unable to make output directory for
    file manifest.`,
  "read-manifest-template-failure": "Unable to read template for file manifest",
  "populating-manifest-tmpl-failed": ol`An error occurred when populating the
    file manifest template.`,
  "manifest-file-write-failure": "Unable to write the file manifest.",
  "unable-to-make-sw-directory": ol`Unable to make the directories to output
    the service worker path.`,
  "sw-write-failure": "Unable to write the service worker file.",
  "sw-write-failure-directory": ol`Unable to write the service worker file;
    'swDest' should be a full path to the file, not a path to a directory.`,
  "unable-to-copy-serwist-libraries": ol`One or more of the Serwist libraries
    could not be copied over to the destination directory: `,
  "invalid-glob-directory": ol`The supplied globDirectory must be a path as a
    string.`,
  "invalid-dont-cache-bust": ol`The supplied 'dontCacheBustURLsMatching'
    parameter must be a RegExp.`,
  "invalid-exclude-files": "The excluded files should be an array of strings.",
  "invalid-get-manifest-entries-input": ol`The input to
    'getFileManifestEntries()' must be an object.`,
  "invalid-manifest-path": ol`The supplied manifest path is not a string with
    at least one character.`,
  "invalid-manifest-entries": ol`The manifest entries must be an array of
    strings or JavaScript objects containing a url parameter.`,
  "invalid-manifest-format": ol`The value of the 'format' option passed to
    generateFileManifest() must be either 'iife' (the default) or 'es'.`,
  "invalid-static-file-globs": ol`The 'globPatterns' value must be an array
    of strings.`,
  "invalid-templated-urls": ol`The 'templatedURLs' value should be an object
    that maps URLs to either a string, or to an array of glob patterns.`,
  "templated-url-matches-glob": ol`One of the 'templatedURLs' URLs is already
    being tracked via 'globPatterns': `,
  "invalid-glob-ignores": ol`The 'globIgnores' parameter must be an array of
    glob pattern strings.`,
  "manifest-entry-bad-url": ol`The generated manifest contains an entry without
    a URL string. This is likely an error with @serwist/build.`,
  "modify-url-prefix-bad-prefixes": ol`The 'modifyURLPrefix' parameter must be
    an object with string key value pairs.`,
  "invalid-inject-manifest-arg": ol`The input to 'injectManifest()' must be an
    object.`,
  "injection-point-not-found": ol`Unable to find a place to inject the manifest.
    Please ensure that your service worker file contains the following: `,
  "multiple-injection-points": ol`Please ensure that your 'swSrc' file contains
    only one match for the following: `,
  "useless-glob-pattern": ol`One of the glob patterns doesn't match any files.
    Please remove or fix the following: `,
  "bad-template-urls-asset": ol`There was an issue using one of the provided
    'templatedURLs'.`,
  "invalid-generate-file-manifest-arg": ol`The input to generateFileManifest()
    must be an Object.`,
  "invalid-sw-src": `The 'swSrc' file can't be read.`,
  "same-src-and-dest": ol`Unable to find a place to inject the manifest. This is
    likely because swSrc and swDest are configured to the same file.
    Please ensure that your swSrc file contains the following:`,
  "no-module-name": ol`You must provide a moduleName parameter when calling
    getModuleURL().`,
  "bad-manifest-transforms-return-value": ol`The return value from a
    manifestTransform should be an object with 'manifest' and optionally
    'warnings' properties.`,
  "string-entry-warning": ol`Some items were passed to additionalPrecacheEntries
    without revisioning info. This is generally NOT safe. Learn more at
    https://bit.ly/wb-precache.`,
  "cant-find-sourcemap": ol`The swSrc file refers to a sourcemap that can't be
    opened:`,
  "manifest-transforms": ol`When using manifestTransforms, you must provide
    an array of functions.`,
};
