import { z } from "zod";

export const fn = <TInput extends [z.ZodType, ...z.ZodType[]], TOutput extends z.ZodType>({ input, output }: { input: TInput; output: TOutput }) => {
  const schema = z.function({
    input: z.tuple(input),
    output,
  });
  return z
    .custom<z.core.$InferInnerFunctionType<z.ZodTuple<TInput, null>, TOutput>>((arg) => typeof arg === "function")
    .transform((arg) => schema.implement(arg));
};

export const asyncFn = <TInput extends [z.ZodType, ...z.ZodType[]], TOutput extends z.ZodType>({
  input,
  output,
}: {
  input: TInput;
  output: TOutput;
}) => {
  const schema = z.function({
    input: z.tuple(input),
    output,
  });
  return z
    .custom<z.core.$InferInnerFunctionTypeAsync<z.ZodTuple<TInput, null>, TOutput>>((arg) => typeof arg === "function")
    .transform((arg) => schema.implementAsync(arg));
};
