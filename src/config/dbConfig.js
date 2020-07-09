export default {
    HOST: 'localhost',
    USER: 'postgres',
    PASSWORD: 'stevegates1',
    DB: 'nodejsmentoring',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
