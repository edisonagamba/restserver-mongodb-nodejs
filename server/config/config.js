// =========== Configuracion puerto ========================
process.env.PORT = process.env.PORT || 3000;

// =========== Entorno ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========== Caducidad token ========================
process.env.TOKEN_CADUCIDAD = '30d';

// =========== Seed token auth ========================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'token_cafeteria_desarrollo';

// =========== Base de datos ==================
let urlDB;
if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafeteria';
} else {
    urlDB = process.env.MONGO_DB_URL;
}

process.env.DB_URL = urlDB;