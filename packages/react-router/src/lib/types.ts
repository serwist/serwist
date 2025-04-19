import type { Preset } from "@react-router/dev/config";

export type ResolvedReactRouterConfig = Parameters<NonNullable<Preset["reactRouterConfigResolved"]>>[0]["reactRouterConfig"];
