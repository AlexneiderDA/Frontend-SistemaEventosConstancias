import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/sesion/Login';
import Signup from './pages/sesion/Signup';
import ForgotPassword from './pages/sesion/ForgotPassword';
import Eventos from './pages/asistente/EventosPage';
import Inicio from './pages/asistente/Inicio';
import DetalleEventoPage from './pages/asistente/DetalleEventoPage';
import RegistroEventoPage from './pages/asistente/RegistroEventoPage';
import MisEventosPage from './pages/asistente/MisEventosPage';
import MisConstanciasPage from './pages/asistente/MisConstancias';
import MiPerfilPage from './pages/asistente/MiPerfilPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/eventos" element={<Eventos />} />
      <Route path="/user/inicio" element={<Inicio />} />
      <Route path="/user/eventos/detalle" element={<DetalleEventoPage />} />
      <Route path="/user/registro-evento" element={<RegistroEventoPage />} />
      <Route path="/user/mis-eventos" element={<MisEventosPage />} />\
      <Route path="/user/constancias" element={<MisConstanciasPage />} />
      <Route path="/user/perfil" element={<MiPerfilPage />} />

      
      {/* Puedes agregar más rutas aquí */}
    </Routes>
  );
}

export default App;