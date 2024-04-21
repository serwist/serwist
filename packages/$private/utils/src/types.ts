/**
 * Make certain fields in a object type required
 *
 * @example
 *     interface A {
 *         a?: string;
 *         b?: string;
 *         c?: string;
 *     }
 *     type B = RequiredFields<A, "b" | "c">;
 *     const b: B = {
 *         b: "hehe",
 *         c: "hehe",
 *     }; //valid
 *     const b: B = { a: "hehe" }; //invalid
 *     const c: B = { a: "hehe", b: "hehe" }; //invalid
 */
export type Require<T, U extends keyof T> = T & Required<Pick<T, U>>;

/**
 * Make certain fields in a object type optional
 *
 * @example
 *     interface A {
 *         a: string;
 *         b: string;
 *         c: string;
 *     }
 *     type B = Optional<A, "b" | "c">;
 *     const b: B = { a: "hehe" }; //valid
 *     const b: B = {}; //invalid
 */
export type Optional<T, U extends keyof T> = Omit<T, U> & Partial<Pick<T, U>>;
