const API_URL = import.meta.env.VITE_API_URL;

export const itemService = {
    create: async (itemData) => {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });
        if (!response.ok) throw new Error("Fallo al crear item");
        return response.json();
    },

    getAll: async () => {
        const response = await fetch(`${API_URL}/items`);
        if (!response.ok) throw new Error("Fallo al leer items");
        return response.json();
    },

    update: async (id, itemData) => {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });
        if (!response.ok) throw new Error("Fallo al actualizar item");
        return response.json(); 
    },

    remove: async (id) => {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE',
        });
        if (response.status !== 204) throw new Error("Fallo al eliminar item");
        return true; 
    },
};