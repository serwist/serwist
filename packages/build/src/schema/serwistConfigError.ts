export class SerwistConfigError extends Error {
  constructor({ moduleName, message }: { moduleName?: string; message?: string }) {
    super(`Received an invalid ${moduleName ?? "Serwist"} configuration: ${message}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
