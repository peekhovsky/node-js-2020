import dotenv from 'dotenv';
dotenv.config();

export default {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.DB_PORT,
    DB: 'nodejsmentoring',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
