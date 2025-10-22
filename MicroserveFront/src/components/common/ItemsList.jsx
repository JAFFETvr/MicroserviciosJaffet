// frontend/src/components/common/ItemsList.jsx (cambiada la ruta por el import original)
import React from 'react';

const ItemsList = ({ items, onEdit, onDelete }) => {
    if (items.length === 0) {
        return <p>No hay items en la base de datos. ¡Crea uno!</p>;
    }

    return (
        <ul className="items-list">
            {items.map(item => (
                <li 
                    key={item.id} 
                    className="item-card"
                >
                    <div className="item-details">
                        <strong>{item.name}</strong> (ID: {item.id}): {item.description}
                    </div>
                    <div>
                        <button 
                            onClick={() => onEdit(item)} 
                            className="edit-button"
                        >
                            Editar
                        </button>
                        <button 
                            onClick={() => onDelete(item.id)} 
                            className="delete-button"
                        >
                            Eliminar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ItemsList;