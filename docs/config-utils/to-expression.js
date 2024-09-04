/**
 * Transform a string into an applicable expression.
 *
 * @param {string} value
 * @returns
 */
export const toExpression = (value) => new RegExp(`^(${value})$`, "i");