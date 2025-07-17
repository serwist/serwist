import type { z } from "zod";

export class SerwistConfigError extends Error {
  constructor({ moduleName, message }: { moduleName?: string; message?: string }) {
    super(`Invalid ${moduleName ?? "Serwist"} configuration:\n${message}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const parsedType = (data: any): string => {
  const t = typeof data;

  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "NaN" : "number";
    }
    case "object": {
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }

      if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
        return data.constructor.name;
      }
    }
  }
  return t;
};

export const validationErrorMap: z.core.$ZodErrorMap = (error) => {
  /* This is where you override the various error codes */
  switch (error.code) {
    case "invalid_type": {
      return `${error.message ?? "Received invalid type"}: expected ${error.expected}, received ${parsedType(error.input)}.`;
    }
    case "invalid_value": {
      return `${error.message ?? "Received invalid value"}: expected ${error.expected}, received ${parsedType(error.input)}.`;
    }
    case "invalid_union": {
      return `${error.message ?? "Received invalid union"}:\n${error.errors.flatMap((err) => err.map((e) => `  → ${e.message}`)).join("\n")}`;
    }
    case "unrecognized_keys": {
      return `${error.message ?? "Received unrecognized keys"}: ${error.keys.join(".")}`;
    }
    case "custom": {
      return error.message ?? undefined;
    }
  }
  return undefined;
};
