import { execSync } from "child_process";

for (const packageName of [
  "@serwist/background-sync",
  "@serwist/broadcast-update",
  "@serwist/cacheable-response",
  "@serwist/core",
  "@serwist/expiration",
  "@serwist/google-analytics",
  "@serwist/navigation-preload",
  "@serwist/precaching",
  "@serwist/range-requests",
  "@serwist/routing",
  "@serwist/strategies",
  "@serwist/sw",
]) {
  execSync(`npm deprecate ${packageName} "This package has been deprecated. Please use serwist instead."`);
}
