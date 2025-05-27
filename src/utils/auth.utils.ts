// src/utils/auth.utils.ts
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: number;
  email: string;
  role: number;
  exp: number;
  iat: number;
}

export const authUtils = {
  // Verificar si el token ha expirado
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true; // Si no se puede decodificar, considerarlo expirado
    }
  },

  // Obtener información del token
  getTokenInfo(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      return null;
    }
  },

  // Verificar si el usuario tiene un rol específico
  hasRole(userRole: number, requiredRole: number): boolean {
    return userRole === requiredRole;
  },

  // Verificar si el usuario es admin
  isAdmin(userRole: number): boolean {
    return userRole === 1;
  },

  // Formatear errores de la API
  formatAPIError(error: any): string {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
      return error.response.data.details.map((detail: any) => detail.message).join(', ');
    }
    
    if (error.response?.status === 401) {
      return 'No tienes autorización para realizar esta acción.';
    }
    
    if (error.response?.status === 403) {
      return 'No tienes permisos para acceder a este recurso.';
    }
    
    if (error.response?.status === 404) {
      return 'El recurso solicitado no fue encontrado.';
    }
    
    if (error.response?.status >= 500) {
      return 'Error del servidor. Por favor, intenta más tarde.';
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Ocurrió un error inesperado.';
  },

  // Limpiar datos de autenticación
  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si hay datos de autenticación válidos
  hasValidAuthData(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return false;
    }
    
    try {
      JSON.parse(user);
      return !this.isTokenExpired(token);
    } catch (error) {
      return false;
    }
  }
};

export default authUtils;