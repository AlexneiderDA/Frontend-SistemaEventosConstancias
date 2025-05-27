// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth.context';
import ProtectedRoute from './components/common/ProtectedRoute';

// Páginas de autenticación
import Login from './pages/sesion/Login';
import Signup from './pages/sesion/Signup';
import ForgotPassword from './pages/sesion/ForgotPassword';

// Páginas del usuario autenticado
import Eventos from './pages/asistente/EventosPage';
import Inicio from './pages/asistente/Inicio';
import DetalleEventoPage from './pages/asistente/DetalleEventoPage';
import RegistroEventoPage from './pages/asistente/RegistroEventoPage';
import MisEventosPage from './pages/asistente/MisEventosPage';
import MisConstanciasPage from './pages/asistente/MisConstancias';
import MiPerfilPage from './pages/asistente/MiPerfilPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas (solo para usuarios no autenticados) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Signup />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <ProtectedRoute requireAuth={false}>
              <ForgotPassword />
            </ProtectedRoute>
          } 
        />

        {/* Rutas protegidas (solo para usuarios autenticados) */}
        <Route 
          path="/user/inicio" 
          element={
            <ProtectedRoute>
              <Inicio />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/eventos" 
          element={
            <ProtectedRoute>
              <Eventos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/eventos/detalle" 
          element={
            <ProtectedRoute>
              <DetalleEventoPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/eventos/:id" 
          element={
            <ProtectedRoute>
              <DetalleEventoPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/registro-evento" 
          element={
            <ProtectedRoute>
              <RegistroEventoPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/eventos/:id/registro" 
          element={
            <ProtectedRoute>
              <RegistroEventoPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/mis-eventos" 
          element={
            <ProtectedRoute>
              <MisEventosPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/constancias" 
          element={
            <ProtectedRoute>
              <MisConstanciasPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/perfil" 
          element={
            <ProtectedRoute>
              <MiPerfilPage />
            </ProtectedRoute>
          } 
        />

        {/* Ruta catch-all para 404 */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-700 mb-4">404</h1>
                <p className="text-gray-500 mb-4">Página no encontrada</p>
                <a 
                  href="/user/inicio" 
                  className="bg-[#1C8443] hover:bg-[#41AD49] text-white px-4 py-2 rounded transition-colors"
                >
                  Ir al inicio
                </a>
              </div>
            </div>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;