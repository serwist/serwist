export type Require<T, U extends keyof T> = T & Required<Pick<T, U>>;
