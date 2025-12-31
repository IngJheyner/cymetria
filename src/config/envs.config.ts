import dotenv from "dotenv";
import path from "path";

// Cargar variables de entorno desde .env (único archivo)
dotenv.config({
	path: path.resolve(__dirname, "../../.env"),
});

const env = process.env.NODE_ENV || "development";
console.log(`[ENV] Loaded .env (NODE_ENV: ${env})`);

export const ENVS_DB = {
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
};

export const ENVS_APP = {
	IS_PRODUCTION: process.env.NODE_ENV === "production", // Bug corregido: era !== debería ser ===
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: process.env.PORT || 3000,
};
