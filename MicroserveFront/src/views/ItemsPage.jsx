// frontend/src/views/ItemsPage.jsx
import React, { useState } from 'react';
import { useItems } from '../viewmodels/useItems'; 
import ItemsList from '../components/common/ItemsList';
import './ItemsPage.css';
const ItemForm = ({ onSubmit, initialData }) => {
    const [name, setName] = useState(initialData.name || '');
    const [description, setDescription] = useState(initialData.description || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ id: initialData.id, name, description });
        // No reseteamos los campos aquí si estamos editando, solo si creamos
        if (!initialData.id) {
            setName('');
            setDescription('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <input 
                type="text" 
                placeholder="Nombre" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="form-input"
            />
            <input 
                type="text" 
                placeholder="Descripción" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="form-input"
            />
            <button type="submit" className="form-button">
                {initialData.id ? 'Actualizar' : 'Crear'} Item
            </button>
        </form>
    );
};


function ItemsPage() {
    const { items, isLoading, apiStatus, handleCreateItem, handleUpdateItem, handleDeleteItem } = useItems();
    const [editingItem, setEditingItem] = useState(null); // Estado local de la View

    // Handlers que solo llaman a las funciones del ViewModel
    const handleCreate = ({ name, description }) => {
        handleCreateItem(name, description);
    };
    
    const handleUpdate = ({ id, name, description }) => {
        handleUpdateItem(id, name, description);
        setEditingItem(null); // Finaliza la edición al actualizar
    };

    return (
        <div className="items-page">
            <h2>Estado de la Conexión</h2>
            <p className="api-status">Status: <strong>{apiStatus}</strong></p>
            
            <hr/>
            
            {/* CREATE / UPDATE FORM */}
            <h2>{editingItem ? 'Editar Item' : 'Crear Nuevo Item'}</h2>
            <ItemForm 
                onSubmit={editingItem ? handleUpdate : handleCreate} 
                // Aseguramos que initialData siempre tenga las propiedades
                initialData={editingItem || { id: null, name: '', description: '' }}
            />
            {editingItem && 
                <button 
                    onClick={() => setEditingItem(null)} 
                    className="cancel-button"
                >
                    Cancelar Edición
                </button>
            }

            <hr/>

            {/* READ LIST usando el componente presentacional */}
            <h2>Lista de Items ({items.length})</h2>
            {isLoading ? (
                <p>Cargando datos...</p>
            ) : (
                <ItemsList 
                    items={items} 
                    onEdit={setEditingItem} // Pasa la función del estado local (View)
                    onDelete={handleDeleteItem} // Pasa la función del ViewModel
                />
            )}
        </div>
    );
}

export default ItemsPage;