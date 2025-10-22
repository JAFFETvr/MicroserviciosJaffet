// frontend/src/viewmodels/useItems.js
import { useState, useEffect, useCallback } from 'react';
import { itemService } from '../models/itemService'; 

export const useItems = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiStatus, setApiStatus] = useState('Probando conexión...');

    // Carga inicial y recarga
    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await itemService.getAll();
            setItems(data);
            setApiStatus('Éxito: Conexión Frontend -> API -> DB lograda.');
        } catch (error) {
            console.error("Error al cargar items:", error);
            setApiStatus(`Error de conexión: ${error.message}.`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 1. CREATE Handler
    const handleCreateItem = async (name, description) => {
        try {
            await itemService.create({ name, description });
            await loadItems(); // Recarga la lista tras crear
        } catch (error) {
            console.error("Error al crear item:", error);
        }
    };
    
    // 3. UPDATE Handler
    const handleUpdateItem = async (id, name, description) => {
        try {
            await itemService.update(id, { name, description });
            await loadItems(); // Recarga la lista tras actualizar
        } catch (error) {
            console.error("Error al actualizar item:", error);
        }
    };
    
    // 4. DELETE Handler
    const handleDeleteItem = async (id) => {
        try {
            await itemService.remove(id);
            await loadItems(); // Recarga la lista tras eliminar
        } catch (error) {
            console.error("Error al eliminar item:", error);
        }
    };

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    return {
        items,
        isLoading,
        apiStatus,
        handleCreateItem,
        handleUpdateItem,
        handleDeleteItem
    };
};