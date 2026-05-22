const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

const poolConfig = databaseUrl
    ? {
        connectionString: databaseUrl
    }
    : {
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || process.env.DB_PASSWORD || "root",
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT || 5432),
        database: process.env.PGDATABASE || "cleaning_portal"
    };

const pool = new Pool(poolConfig);

module.exports = pool;