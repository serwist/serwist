export type Equals<T, S> = [T] extends [S] ? ([S] extends [T] ? true : false) : false;

export function assertType<_T extends true>() {
  // Do nothing
}
