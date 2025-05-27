// src/services/auth.service.ts (Versión con debug)
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

console.log('🔧 API_BASE_URL configurada como:', API_BASE_URL);

// Configurar axios con interceptores
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Interceptor para agregar logs de request
api.interceptors.request.use(
  (config) => {
    console.log('📤 Enviando request a:', config.url);
    console.log('📤 Método:', config.method);
    console.log('📤 Headers:', config.headers);
    console.log('📤 Data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response exitosa:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.error('❌ Error en response:', error);
    console.error('❌ Error config:', error.config);
    console.error('❌ Error response:', error.response);
    
    const originalRequest = error.config;

    // Si el token expiró, intentar renovarlo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Intentando renovar token...');
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Error renovando token:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  rolId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authService = {
  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔐 Intentando login con:', { email: data.email });
    
    try {
      const response = await api.post('/api/auth/login', data);
      
      const { user, token } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Login exitoso:', user);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  },

  // Signup
  async signup(data: SignupData): Promise<AuthResponse> {
    console.log('📝 Intentando signup con:', { 
      name: data.name, 
      email: data.email 
    });
    
    try {
      const response = await api.post('/api/auth/register', data);
      
      const { user, token } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Signup exitoso:', user);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en signup:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    console.log('👋 Cerrando sesión...');
    
    try {
      await api.post('/api/auth/logout');
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error al hacer logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('🧹 Datos locales limpiados');
    }
  },

  // Refresh token
  async refreshToken(): Promise<{ token: string }> {
    console.log('🔄 Renovando token...');
    
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    
    const { token } = response.data;
    localStorage.setItem('token', token);
    
    console.log('✅ Token renovado');
    
    return response.data;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const isAuth = !!(token && user);
    
    console.log('🔍 Verificando autenticación:', isAuth);
    
    return isAuth;
  },

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('👤 Usuario actual:', user);
        return user;
      } catch (error) {
        console.error('❌ Error al parsear usuario:', error);
        return null;
      }
    }
    console.log('👤 No hay usuario guardado');
    return null;
  },

  // Obtener token actual
  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('🎫 Token actual:', token ? 'Existe' : 'No existe');
    return token;
  }
};

export default authService;