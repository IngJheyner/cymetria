import { Table, Column, Model, DataType, PrimaryKey } from "sequelize-typescript";

/**
 * Modelo de persistencia para usuarios en MySQL
 */
@Table({ 
	tableName: "users",
	timestamps: true, // Crea automáticamente createdAt y updatedAt
})
export class UserModel extends Model {
	@Column({
		primaryKey: true,
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4, // Genera UUID automáticamente
	})
	id!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name!: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
		unique: true, // Email único a nivel de BD
	})
	email!: string;

	// Sequelize crea estos campos automáticamente con timestamps: true
	declare createdAt: Date;
	declare updatedAt: Date;
}
