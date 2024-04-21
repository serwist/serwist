import { z } from "zod";

export const validationErrorMap: z.ZodErrorMap = (error, ctx) => {
  /*
    This is where you override the various error codes
    */
  switch (error.code) {
    case z.ZodIssueCode.invalid_type: {
      return { message: `${error.message ?? "Received invalid type"}: expected ${error.expected}, received ${error.received}.` };
    }
    case z.ZodIssueCode.invalid_literal: {
      return { message: `${error.message ?? "Received invalid literal"}: expected ${error.expected}, received ${error.received}.` };
    }
    case z.ZodIssueCode.unrecognized_keys: {
      return { message: `${error.message ?? "Received unrecognized keys"}: ${error.keys.join(",")}` };
    }
    case z.ZodIssueCode.invalid_arguments: {
      return {
        message: `${error.message ?? "Received invalid arguments"}: ${error.argumentsError.errors.map((e) => validationErrorMap(e, ctx)).join(",")}.`,
      };
    }
    case z.ZodIssueCode.invalid_return_type: {
      return {
        message: `${error.message ?? "Received invalid return type"}: ${error.returnTypeError.errors
          .map((e) => validationErrorMap(e, ctx))
          .join(",")}.`,
      };
    }
    case z.ZodIssueCode.custom: {
      return { message: error.message ?? ctx.defaultError };
    }
  }

  // Fallback to the default message.
  return { message: ctx.defaultError };
};
