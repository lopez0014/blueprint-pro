import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initBackendSimulation } from './services/apiBridge'

// Inicializar logs y simulación de backend en consola del navegador
initBackendSimulation();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
