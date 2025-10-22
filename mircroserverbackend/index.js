// index.js (CORRECCIÓN FINAL, usando 'infraestructure')
const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2/promise');
// ¡CORREGIDO! Usando 'infraestructure' para coincidir con tu ruta confirmada
const { app, initializeServer } = require('./src/infraestructure/server'); 
const MysqlItemRepository = require('./src/infraestructure/MysqlItemRepository');
const ItemFinder = require('./src/application/ItemFinder');
const ItemCreator = require('./src/application/ItemCreator');
const ItemUpdater = require('./src/application/ItemUpdater');
const ItemDeleter = require('./src/application/ItemDeleter');

const PORT = process.env.API_PORT || 5000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function setupDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection({ host: dbConfig.host, user: dbConfig.user, password: dbConfig.password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        connection = await mysql.createConnection(dbConfig);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description VARCHAR(255)
            )
        `);
        console.log('DB lista y tabla verificada.');
        return connection;
    } catch (error) {
        console.error('Error al configurar la base de datos:', error.message);
        throw error;
    }
}

async function startApplication() {
    try {
        const dbConnection = await setupDatabase();
        
        const itemRepository = new MysqlItemRepository(dbConnection); 

        const itemFinder = new ItemFinder(itemRepository);
        const itemCreator = new ItemCreator(itemRepository);
        const itemUpdater = new ItemUpdater(itemRepository);
        const itemDeleter = new ItemDeleter(itemRepository);

        initializeServer({ itemFinder, itemCreator, itemUpdater, itemDeleter });
        
        app.listen(PORT, () => {
            console.log(`API (Hexagonal) corriendo en http://localhost:${PORT}`);
        });

    } catch (e) {
        console.error('La aplicación falló al iniciar. Reintentando en 5s...');
        setTimeout(startApplication, 5000); 
    }
}

startApplication();