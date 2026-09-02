export class PublicApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    public readonly publicMessage: string,
    options?: ErrorOptions,
  ) {
    super(publicMessage, options);
    this.name = "PublicApiError";
  }
}