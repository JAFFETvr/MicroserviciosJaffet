-- data/init.sql
USE vicente_database;

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO items (name, description) VALUES 
('Vicente Laptop', 'Item de prueba 1'),
('Rincon Mouse', 'Item de prueba 2');