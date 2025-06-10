// src/services/attendee.service.ts
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

// ===== INTERFACES =====

export interface Attendee {
  id: number;
  userId: number;
  eventId: number;
  registrationDate: string;
  status: 'registered' | 'confirmed' | 'attended' | 'absent' | 'cancelled';
  attendanceCheckedIn?: string;
  attendanceCheckedOut?: string;
  qrCode?: string;
  notes?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  user: {
    id: number;
    name: string;
    email: string;
    profile?: {
      phone?: string;
      institution?: string;
    };
  };
  event: {
    id: number;
    title: string;
    startDate: string;
    location: string;
  };
  sessionRegistrations?: Array<{
    id: number;
    session: {
      id: number;
      title: string;
      startTime: string;
      endTime: string;
    };
  }>;
}

export interface AttendeeFilters {
  page?: number;
  limit?: number;
  eventId?: number;
  status?: string;
  search?: string;
  sortBy?: 'name' | 'email' | 'registrationDate' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface AttendeesResponse {
  success: boolean;
  data: {
    attendees: Attendee[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    statistics: {
      total: number;
      registered: number;
      confirmed: number;
      attended: number;
      absent: number;
      cancelled: number;
    };
  };
}

export interface UserSearchResult {
  id: number;
  name: string;
  email: string;
  profile?: {
    phone?: string;
    institution?: string;
  };
}

export interface AddAttendeeData {
  userId: number;
  eventId: number;
  notes?: string;
}

export interface UpdateAttendeeData {
  status?: 'registered' | 'confirmed' | 'attended' | 'absent' | 'cancelled';
  notes?: string;
  cancellationReason?: string;
}

export interface CommunicationData {
  attendeeIds: number[];
  subject: string;
  message: string;
  type: 'email' | 'notification';
}

export interface BulkActionData {
  attendeeIds: number[];
  action: 'confirm' | 'cancel' | 'delete' | 'export';
  reason?: string;
}

// ===== SERVICIO =====

export const attendeeService = {
  // Obtener asistentes con filtros y paginación
  async getAttendees(filters: AttendeeFilters = {}): Promise<AttendeesResponse> {
    try {
      console.log('👥 Obteniendo asistentes con filtros:', filters);
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/api/attendees?${params.toString()}`);
      console.log('✅ Asistentes obtenidos:', response.data.data.attendees.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener asistentes:', error);
      throw error;
    }
  },

  // Obtener asistentes de un evento específico
  async getEventAttendees(eventId: number, filters: Omit<AttendeeFilters, 'eventId'> = {}): Promise<AttendeesResponse> {
    try {
      console.log('📅 Obteniendo asistentes del evento:', eventId);
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/api/events/${eventId}/attendees?${params.toString()}`);
      console.log('✅ Asistentes del evento obtenidos:', response.data.data.attendees.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener asistentes del evento:', error);
      throw error;
    }
  },

  // Buscar usuarios para agregar como asistentes
  async searchUsers(query: string): Promise<{ success: boolean; data: UserSearchResult[] }> {
    try {
      console.log('🔍 Buscando usuarios:', query);
      
      const response = await api.get(`/api/users/search?q=${encodeURIComponent(query)}`);
      console.log('✅ Usuarios encontrados:', response.data.data.length);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al buscar usuarios:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  async getUserById(userId: number): Promise<{ success: boolean; data: UserSearchResult }> {
    try {
      console.log('👤 Obteniendo usuario por ID:', userId);
      
      const response = await api.get(`/api/users/${userId}`);
      console.log('✅ Usuario obtenido');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener usuario:', error);
      throw error;
    }
  },

  // Agregar asistente a un evento
  async addAttendee(data: AddAttendeeData): Promise<{ success: boolean; data: Attendee; message: string }> {
    try {
      console.log('➕ Agregando asistente:', data);
      
      const response = await api.post(`/api/events/${data.eventId}/attendees`, {
        userId: data.userId,
        notes: data.notes
      });
      
      console.log('✅ Asistente agregado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ Error al agregar asistente:', error);
      throw error;
    }
  },

  // Actualizar información del asistente
  async updateAttendee(attendeeId: number, data: UpdateAttendeeData): Promise<{ success: boolean; data: Attendee; message: string }> {
    try {
      console.log('📝 Actualizando asistente:', attendeeId, data);
      
      const response = await api.put(`/api/attendees/${attendeeId}`, data);
      console.log('✅ Asistente actualizado');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar asistente:', error);
      throw error;
    }
  },

  // Eliminar asistente
  async removeAttendee(attendeeId: number, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🗑️ Eliminando asistente:', attendeeId);
      
      const response = await api.delete(`/api/attendees/${attendeeId}`, {
        data: { reason }
      });
      
      console.log('✅ Asistente eliminado');
      return response.data;
    } catch (error) {
      console.error('❌ Error al eliminar asistente:', error);
      throw error;
    }
  },

  // Enviar comunicación a asistentes
  async sendCommunication(data: CommunicationData): Promise<{ success: boolean; message: string }> {
    try {
      console.log('📧 Enviando comunicación a asistentes:', data.attendeeIds.length);
      
      const response = await api.post('/api/attendees/communication', data);
      console.log('✅ Comunicación enviada');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al enviar comunicación:', error);
      throw error;
    }
  },

  // Acciones masivas
  async bulkAction(data: BulkActionData): Promise<{ success: boolean; message: string; results?: any }> {
    try {
      console.log('📋 Ejecutando acción masiva:', data.action, 'para', data.attendeeIds.length, 'asistentes');
      
      const response = await api.post('/api/attendees/bulk-action', data);
      console.log('✅ Acción masiva completada');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en acción masiva:', error);
      throw error;
    }
  },

  // Exportar lista de asistentes
  async exportAttendees(eventId: number, format: 'csv' | 'excel' = 'csv', filters?: AttendeeFilters): Promise<{ success: boolean; data: { downloadUrl: string } }> {
    try {
      console.log('📊 Exportando asistentes del evento:', eventId, 'en formato:', format);
      
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }
      params.append('format', format);

      const response = await api.post(`/api/events/${eventId}/attendees/export?${params.toString()}`);
      console.log('✅ Exportación iniciada');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al exportar asistentes:', error);
      throw error;
    }
  },

  // Check-in/Check-out de asistente
  async checkInAttendee(attendeeId: number): Promise<{ success: boolean; message: string; data: { checkedInAt: string } }> {
    try {
      console.log('✅ Marcando entrada del asistente:', attendeeId);
      
      const response = await api.post(`/api/attendees/${attendeeId}/check-in`);
      console.log('✅ Entrada marcada');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al marcar entrada:', error);
      throw error;
    }
  },

  async checkOutAttendee(attendeeId: number): Promise<{ success: boolean; message: string; data: { checkedOutAt: string } }> {
    try {
      console.log('🚪 Marcando salida del asistente:', attendeeId);
      
      const response = await api.post(`/api/attendees/${attendeeId}/check-out`);
      console.log('✅ Salida marcada');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al marcar salida:', error);
      throw error;
    }
  },

  // Obtener estadísticas de asistencia
  async getAttendanceStats(eventId: number): Promise<{ success: boolean; data: any }> {
    try {
      console.log('📊 Obteniendo estadísticas de asistencia para evento:', eventId);
      
      const response = await api.get(`/api/events/${eventId}/attendance-stats`);
      console.log('✅ Estadísticas obtenidas');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error;
    }
  }
};

export default attendeeService;