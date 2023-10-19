import type { Flag } from "meow";

export type StringFlag = Flag<'string', string> | Flag<'string', string[], true>;
export type BooleanFlag = Flag<'boolean', boolean> | Flag<'boolean', boolean[], true>;
export type NumberFlag = Flag<'number', number> | Flag<'number', number[], true>;
export type AnyFlag = StringFlag | BooleanFlag | NumberFlag;
export type AnyFlags = Record<string, AnyFlag>;