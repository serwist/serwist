// Source (MIT): https://github.com/lukeed/clsx
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];
export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;

const toClassName = (classValue: ClassValue) => {
  let className = "";

  if (typeof classValue === "string" || typeof classValue === "number") {
    className += classValue;
  } else if (typeof classValue === "object") {
    if (Array.isArray(classValue)) {
      for (const k of classValue) {
        if (k) {
          const resolvedClassName = toClassName(k);
          if (resolvedClassName) {
            className && (className += " ");
            className += resolvedClassName;
          }
        }
      }
    } else {
      for (const k in classValue) {
        if (classValue[k]) {
          className && (className += " ");
          className += k;
        }
      }
    }
  }

  return className;
};

export const clsx = (...inputs: ClassValue[]) => {
  let className = "";
  for (const input of inputs) {
    if (input) {
      const resolvedClassName = toClassName(input);
      if (resolvedClassName) {
        className && (className += " ");
        className += resolvedClassName;
      }
    }
  }
  return className;
};
