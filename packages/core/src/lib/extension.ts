import type { MaybePromise } from "@serwist/utils";
import type { Serwist } from "./core.js";

export interface InitCallbackParam {
  serwist: Serwist;
}

export type InitCallback = (param: InitCallbackParam) => MaybePromise<void>;

export interface InstallCallbackParam {
  event: ExtendableEvent;
  serwist: Serwist;
}

export type InstallCallback = (param: InstallCallbackParam) => MaybePromise<void>;

export interface ActivateCallbackParam {
  event: ExtendableEvent;
  serwist: Serwist;
}

export type ActivateCallback = (param: ActivateCallbackParam) => MaybePromise<void>;

/**
 * An object with optional lifecycle callback properties for Serwist's operations.
 */
export interface Extension {
  init?: InitCallback;
  install?: InstallCallback;
  activate?: ActivateCallback;
}

export interface ExtensionParam {
  init: InitCallbackParam;
  install: InstallCallbackParam;
  activate: ActivateCallbackParam;
}
