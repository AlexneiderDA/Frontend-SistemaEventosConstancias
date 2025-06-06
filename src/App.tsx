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

//Paginas del organizador
import {CreacionEvento} from './pages/organizador/CreacionEvento';
import {DashboardOrganizador}from './pages/organizador/Dashboard';
import { EmisionConstancias } from './pages/organizador/EmisionConstancias';
import { GestionAsistentes } from './pages/organizador/GestionAsistencias';
import { GestionEventos } from './pages/organizador/GestionEvento';
import { GestionPersonal } from './pages/organizador/GestionPersonal';
import { MetricasTiempoReal } from './pages/organizador/MetricasTiempoReal';
import { Reportes } from './pages/organizador/Reportes';

// Páginas de administración
import { Dashboard } from './pages/admin/Dashboard';
import { Users } from './pages/admin/Users';
import { Events } from './pages/admin/Events';
import { Roles } from './pages/admin/Roles';
import { CertificateTemplates } from './pages/admin/CertificateTemplates';
import { EmailTemplates } from './pages/admin/EmailTemplates';
import { Settings } from './pages/admin/Settings';
import { SystemLog } from './pages/admin/SystemLog';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {<>
                <Route path="/admin" element={<Dashboard/>}> </Route>
                <Route path="/admin/users" element={<Users/>}> </Route>
                <Route path="/admin/events" element={<Events/>}> </Route>
                <Route path="/admin/roles" element={<Roles/>}> </Route>
                <Route path="/admin/certificates" element={<CertificateTemplates/>}> </Route>
                <Route path="/admin/email" element={<EmailTemplates/>}> </Route>
                <Route path="/admin/settings" element={<Settings/>}> </Route>
                <Route path="/admin/systemslog" element={<SystemLog/>}> </Route>
                <Route path="/organizador/dashboard" element={<DashboardOrganizador/>}> </Route>
                <Route path="/organizador/creacion-evento" element={<CreacionEvento/>}> </Route> 
                <Route path="/organizador/gestion-eventos" element={<GestionEventos/>}> </Route>
                <Route path="/organizador/gestion-asistentes" element={<GestionAsistentes/>}> </Route>
                <Route path="/organizador/gestion-personal" element={<GestionPersonal/>}> </Route>
                <Route path="/organizador/metricas-tiempo-real" element={<MetricasTiempoReal/>}> </Route> 
                <Route path="/organizador/reportes" element={<Reportes/>}> </Route>
                <Route path="/organizador/emision-constancias" element={<EmisionConstancias/>}> </Route>

              </>}
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