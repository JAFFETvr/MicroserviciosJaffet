// src/infrastructure/MysqlItemRepository.js
const ItemRepository = require('../domain/ItemRepository');
const Item = require('../domain/Item'); // Asumo que tienes una clase Item en tu dominio

class MysqlItemRepository extends ItemRepository {
    constructor(dbConnection) {
        super();
        this.connection = dbConnection;
    }

    // C: Create (Usando el save genérico)
    async save(item) {
        const [result] = await this.connection.query(
            'INSERT INTO items (name, description) VALUES (?, ?)',
            [item.name, item.description]
        );
        // Devuelve el nuevo ítem con el ID asignado por la DB
        return new Item(result.insertId, item.name, item.description); 
    }

    // R: Read (Buscar por ID)
    async findById(id) {
        const [rows] = await this.connection.query('SELECT * FROM items WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return null; // El puerto debe devolver null si no lo encuentra
        }
        
        const row = rows[0];
        return new Item(row.id, row.name, row.description);
    }
    
    // R: Read (Buscar todos)
    async findAll() {
        const [rows] = await this.connection.query('SELECT * FROM items ORDER BY id DESC');
        // Mapea los resultados crudos de la DB a objetos de Dominio (Item)
        return rows.map(row => new Item(row.id, row.name, row.description));
    }

    // U: Update
    async update(item) {
        const [result] = await this.connection.query(
            'UPDATE items SET name = ?, description = ? WHERE id = ?',
            [item.name, item.description, item.id]
        );
        if (result.affectedRows === 0) {
            // Lanza error para que el caso de uso lo maneje
            throw new Error(`Item with ID ${item.id} not found.`);
        }
    }

    // D: Delete
    async delete(id) {
        const [result] = await this.connection.query('DELETE FROM items WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            // Lanza error si el ítem a borrar no existe
            throw new Error(`Item with ID ${id} not found.`);
        }
    }
}
module.exports = MysqlItemRepository;