import { useState } from 'react'
import ItemsPage from './views/ItemsPage'
import './App.css'

function App() {

  const MI_NOMBRE = import.meta.env.VITE_MI_NOMBRE;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Microservicios CRUD (React MVVM)</h1>
      
      <div style={{ padding: '10px', backgroundColor: '#e6ffe6', borderLeft: '5px solid green' }}>
        <strong>Desarrollador:</strong> <span style={{ color: 'darkgreen' }}>{MI_NOMBRE || 'Nombre no cargado'}</span>.
      </div>
      
      <ItemsPage />
    </div>
  );
  
}

export default App