export class User {
	constructor(
		public name: string,
		public email: string,
		public readonly id?: string,
		public readonly createdAt?: Date,
		public readonly updatedAt?: Date
	) {}
}
