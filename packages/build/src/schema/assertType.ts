export type Equals<T, S> = [T] extends [S] ? ([S] extends [T] ? true : false) : false;

export type Assignable<T, U> = [U] extends [T] ? true : false;

export function assertType<_T extends true>() {
  // Do nothing
}
