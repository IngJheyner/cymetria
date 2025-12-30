/**
 * Excepción HTTP personalizada
 */
export class HttpException extends Error {
	constructor(
		public status: number,
		public message: string,
		public data?: any
	) {
		super(message);
		this.name = "HttpException";
	}
}
