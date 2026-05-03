import path from "node:path";
import type { InputOption } from "rolldown";

export const normalizeInput = (input: InputOption | undefined): Record<string, string> => {
  return !input
    ? {}
    : typeof input === "string"
      ? { [path.parse(input).name]: input }
      : Array.isArray(input)
        ? Object.fromEntries(input.map((entry) => [path.parse(entry).name, entry]))
        : input;
};
