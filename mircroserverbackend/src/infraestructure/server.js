const express = require('express');
const cors = require('cors');

let itemFinder, itemCreator, itemUpdater, itemDeleter;


const TU_APELLIDO = process.env.TU_APELLIDO || 'VicenteRincon'; 
const TU_NOMBRE_COMPLETO = process.env.TU_NOMBRE_COMPLETO || 'Carlos Jaffet Vicente Rincon';


const app = express();
app.use(express.json());
app.use(cors());

const initializeServer = (dependencies) => {
    itemFinder = dependencies.itemFinder;
    itemCreator = dependencies.itemCreator;
    itemUpdater = dependencies.itemUpdater;
    itemDeleter = dependencies.itemDeleter;
}

// Esta ruta ahora usa las variables de entorno
app.get(`/${TU_APELLIDO}/nombre-completo`, (req, res) => {
    res.json({ 
        nombre_completo: TU_NOMBRE_COMPLETO 
    });
});

app.post('/items', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newItem = await itemCreator.run(name, description); 
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await itemFinder.findAll(); 
        res.json(items);
    } catch (err) {
        res.status(500).send('Error al obtener items: ' + err.message);
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, description } = req.body;
        await itemUpdater.run(id, name, description);
        res.json({ id, name, description, message: 'Item actualizado' });
    } catch (err) {
        if (err.message.includes('not found')) return res.status(404).send(err.message);
        res.status(500).send('Error al actualizar item: ' + err.message);
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await itemDeleter.run(id);
        res.status(204).send();
    } catch (err) {
        if (err.message.includes('not found')) return res.status(404).send(err.message);
        res.status(500).send('Error al eliminar item: ' + err.message);
    }
});

module.exports = { app, initializeServer };