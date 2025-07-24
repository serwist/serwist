import type { MaybePromise } from "@serwist/utils";
import { z } from "zod";

/**
 * Prevents TS from inlining a schema’s inferred type.
 * @internal
 */
export const reference = <Output, Input = Output>(schema: z.ZodType<Output, Input>) => {
  return schema;
};

export const asyncFn = <TInput extends [z.ZodType, ...z.ZodType[]], TOutput extends z.ZodType>({
  input,
  output,
}: {
  input: TInput;
  output: TOutput;
}): z.ZodType<
  (...args: z.input<z.ZodTuple<TInput, null>>) => MaybePromise<z.output<TOutput>>,
  (...args: z.output<z.ZodTuple<TInput, null>>) => MaybePromise<z.input<TOutput>>
> => {
  const schema = z.function({
    input: z.tuple(input),
    output,
  });
  return z
    .custom<(...args: z.output<z.ZodTuple<TInput, null>>) => MaybePromise<z.input<TOutput>>>((arg) => typeof arg === "function")
    .transform((arg) => schema.implementAsync(arg));
};

export const fn = <TInput extends [z.ZodType, ...z.ZodType[]], TOutput extends z.ZodType>({
  input,
  output,
}: {
  input: TInput;
  output: TOutput;
}): z.ZodType<
  (...args: z.input<z.ZodTuple<TInput, null>>) => z.output<TOutput>,
  (...args: z.output<z.ZodTuple<TInput, null>>) => z.input<TOutput>
> => {
  const schema = z.function({
    input: z.tuple(input),
    output,
  });
  return z
    .custom<(...args: z.output<z.ZodTuple<TInput, null>>) => z.input<TOutput>>((arg) => typeof arg === "function")
    .transform((arg) => schema.implement(arg));
};
