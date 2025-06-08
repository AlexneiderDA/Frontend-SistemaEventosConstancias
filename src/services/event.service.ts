// src/services/event.service.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Configurar axios con interceptores
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Interfaces actualizadas
export interface CreateEventData {
  title: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  startDate: string; // ISO datetime string
  endDate: string; // ISO datetime string
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  location: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  directions?: string;
  categoryId: number;
  maxCapacity: number;
  requiresCertificate?: boolean;
  isFeatured?: boolean;
  requirements?: string[];
  tags?: string[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  categoryId: number;
  maxCapacity: number;
  currentRegistrations: number;
  requiresCertificate: boolean;
  isActive: boolean;
  isFeatured: boolean;
  requirements: string[];
  tags: string[];
  organizerId: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    color: string;
  };
  organizer: {
    id: number;
    name: string;
    email: string;
  };
  // Campos calculados
  availableSlots?: number;
  registrationStatus?: 'available' | 'full';
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface EventFilters {
  page?: number;
  limit?: number;
  category?: number;
  search?: string;
  featured?: boolean;
  status?: string;
  sortBy?: 'date' | 'title' | 'capacity' | 'registrations';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface EventsResponse {
  success: boolean;
  data: {
    events: Event[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface CreateEventResponse {
  success: boolean;
  message: string;
  data: Event;
}

export interface UpdateEventResponse {
  success: boolean;
  message: string;
  data: Event;
}

export interface DeleteEventResponse {
  success: boolean;
  message: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

// Utilidades para transformación de datos
export const transformEvent = (apiEvent: Event): Event => {
  const now = new Date();
  const startDate = new Date(apiEvent.startDate);
  const endDate = new Date(apiEvent.endDate);
  
  let status: 'upcoming' | 'active' | 'completed' | 'cancelled' = 'upcoming';
  if (!apiEvent.isActive) {
    status = 'cancelled';
  } else if (now >= startDate && now <= endDate) {
    status = 'active';
  } else if (now > endDate) {
    status = 'completed';
  }

  return {
    ...apiEvent,
    status,
    availableSlots: apiEvent.maxCapacity - (apiEvent.currentRegistrations || 0),
    registrationStatus: (apiEvent.maxCapacity <= (apiEvent.currentRegistrations || 0)) ? 'full' : 'available'
  };
};

export const eventService = {
  // Crear evento
  async createEvent(data: CreateEventData): Promise<CreateEventResponse> {
    console.log('📅 Creando evento:', data.title);
    console.log('📋 Datos enviados:', JSON.stringify(data, null, 2));
    
    try {
      const response = await api.post('/api/events', data);
      console.log('✅ Evento creado exitosamente:', response.data);
      return {
        ...response.data,
        data: transformEvent(response.data.data)
      };
    } catch (error: any) {
      console.error('❌ Error al crear evento:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);
      throw error;
    }
  },

  // Obtener eventos con filtros y paginación
  async getEvents(filters: EventFilters = {}): Promise<EventsResponse> {
    try {
      console.log('📋 Obteniendo eventos con filtros:', filters);
      
      // Construir parámetros de query
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/api/events?${params.toString()}`);
      console.log('✅ Eventos obtenidos:', response.data.data.events.length);
      
      return {
        ...response.data,
        data: {
          ...response.data.data,
          events: response.data.data.events.map(transformEvent)
        }
      };
    } catch (error) {
      console.error('❌ Error al obtener eventos:', error);
      throw error;
    }
  },

  // Obtener evento por ID
  async getEventById(id: number): Promise<{ success: boolean; data: Event }> {
    try {
      console.log('🔍 Obteniendo evento:', id);
      const response = await api.get(`/api/events/${id}`);
      console.log('✅ Evento obtenido');
      
      return {
        ...response.data,
        data: transformEvent(response.data.data)
      };
    } catch (error) {
      console.error('❌ Error al obtener evento:', error);
      throw error;
    }
  },

  // Actualizar evento
  async updateEvent(id: number, data: Partial<CreateEventData>): Promise<UpdateEventResponse> {
    console.log('📝 Modificando evento:', id);
    console.log('📋 Datos enviados:', JSON.stringify(data, null, 2));
    
    try {
      const response = await api.put(`/api/events/${id}`, data);
      console.log('✅ Evento modificado exitosamente:', response.data);
      
      return {
        ...response.data,
        data: transformEvent(response.data.data)
      };
    } catch (error: any) {
      console.error('❌ Error al modificar evento:', error);
      console.error('❌ Response data:', error.response?.data);
      console.error('❌ Response status:', error.response?.status);
      throw error;
    }
  },

  // Eliminar evento (soft delete)
  async deleteEvent(id: number): Promise<DeleteEventResponse> {
    try {
      console.log('🗑️ Eliminando evento:', id);
      const response = await api.delete(`/api/events/${id}`);
      console.log('✅ Evento eliminado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar evento:', error);
      throw error;
    }
  },

  // Duplicar evento
  async duplicateEvent(id: number): Promise<CreateEventResponse> {
    try {
      console.log('📋 Duplicando evento:', id);
      
      // Obtener el evento original
      const originalEvent = await this.getEventById(id);
      
      // Preparar datos para duplicación
      const duplicatedData: CreateEventData = {
        title: `${originalEvent.data.title} (Copia)`,
        description: originalEvent.data.description,
        shortDescription: originalEvent.data.shortDescription,
        imageUrl: originalEvent.data.imageUrl,
        startDate: originalEvent.data.startDate,
        endDate: originalEvent.data.endDate,
        startTime: originalEvent.data.startTime,
        endTime: originalEvent.data.endTime,
        location: originalEvent.data.location,
        address: originalEvent.data.address,
        categoryId: originalEvent.data.categoryId,
        maxCapacity: originalEvent.data.maxCapacity,
        requiresCertificate: originalEvent.data.requiresCertificate,
        isFeatured: false, // Los duplicados no son destacados por defecto
        requirements: originalEvent.data.requirements,
        tags: originalEvent.data.tags,
      };
      
      // Crear el evento duplicado
      const response = await this.createEvent(duplicatedData);
      console.log('✅ Evento duplicado exitosamente');
      return response;
    } catch (error) {
      console.error('❌ Error al duplicar evento:', error);
      throw error;
    }
  },

  // Obtener categorías
  async getCategories(): Promise<Category[]> {
    try {
      console.log('📂 Obteniendo categorías...');
      const response = await api.get('/api/categories');
      console.log('✅ Categorías obtenidas:', response.data.data?.length || 0);
      
      // Manejar diferentes formatos de respuesta
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      throw error;
    }
  },

  // Obtener eventos destacados
  async getFeaturedEvents(): Promise<Event[]> {
    try {
      console.log('⭐ Obteniendo eventos destacados...');
      const response = await api.get('/api/events/featured');
      console.log('✅ Eventos destacados obtenidos:', response.data.data?.length || 0);
      
      if (response.data.success && response.data.data) {
        return response.data.data.map(transformEvent);
      }
      return [];
    } catch (error) {
      console.error('❌ Error al obtener eventos destacados:', error);
      throw error;
    }
  },

  // Cambiar estado destacado de evento (para administradores)
  async toggleFeatured(id: number): Promise<UpdateEventResponse> {
    try {
      console.log('⭐ Cambiando estado destacado del evento:', id);
      const response = await api.post(`/api/events/${id}/toggle-featured`);
      console.log('✅ Estado destacado cambiado');
      
      return {
        ...response.data,
        data: transformEvent(response.data.data)
      };
    } catch (error) {
      console.error('❌ Error al cambiar estado destacado:', error);
      throw error;
    }
  },

  // Obtener estadísticas del evento (para organizadores)
  async getEventStats(id: number): Promise<any> {
    try {
      console.log('📊 Obteniendo estadísticas del evento:', id);
      const response = await api.get(`/api/events/${id}/stats`);
      console.log('✅ Estadísticas obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error;
    }
  }
};

export default eventService;