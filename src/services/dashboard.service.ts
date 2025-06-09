// src/services/dashboard.service.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Configurar axios con interceptores (similar al event.service.ts)
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

export interface DashboardStats {
  events: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
    trend: number;
  };
  registrations: {
    total: number;
    today: number;
    trend: number;
  };
  attendance: {
    today: number;
    rate: number;
    expected: number;
  };
  certificates: {
    total: number;
    today: number;
  };
}

export interface UpcomingEvent {
  id: number;
  title: string;
  startDate: string;
  startTime: string;
  location: string;
  category: {
    id: number;
    name: string;
    color: string;
  };
  registrations: number;
  maxCapacity: number;
  availableSlots: number;
  hoursUntil: number;
  status: 'upcoming' | 'soon' | 'very-soon';
}

export interface DashboardNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface UserActivity {
  id: number;
  activityType: string;
  description: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  metadata?: any;
  createdAt: string;
}

export interface DashboardResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface NotificationsResponse {
  notifications: DashboardNotification[];
  unreadCount: number;
}

// ===== SERVICIOS =====

export const dashboardService = {
  // Obtener estadísticas del organizador
  async getOrganizerStats(): Promise<DashboardResponse<DashboardStats>> {
    try {
      console.log('📊 Obteniendo estadísticas del organizador...');
      const response = await api.get('/api/dashboard/organizer/stats');
      console.log('✅ Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Obtener próximos eventos del organizador
  async getOrganizerUpcomingEvents(limit: number = 5): Promise<DashboardResponse<UpcomingEvent[]>> {
    try {
      console.log('📅 Obteniendo próximos eventos...');
      const response = await api.get(`/api/dashboard/organizer/upcoming-events?limit=${limit}`);
      console.log('✅ Próximos eventos obtenidos:', response.data.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener próximos eventos:', error);
      throw error;
    }
  },

  // Obtener notificaciones del organizador
  async getOrganizerNotifications(
    limit: number = 10, 
    unreadOnly: boolean = false
  ): Promise<DashboardResponse<NotificationsResponse>> {
    try {
      console.log('🔔 Obteniendo notificaciones...');
      const params = new URLSearchParams({
        limit: limit.toString(),
        unreadOnly: unreadOnly.toString()
      });
      
      const response = await api.get(`/api/dashboard/organizer/notifications?${params}`);
      console.log('✅ Notificaciones obtenidas:', response.data.data.notifications.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener notificaciones:', error);
      throw error;
    }
  },

  // Marcar notificación como leída
  async markNotificationAsRead(notificationId: number): Promise<DashboardResponse<any>> {
    try {
      console.log('✅ Marcando notificación como leída:', notificationId);
      const response = await api.post(`/api/dashboard/organizer/notifications/${notificationId}/read`);
      console.log('✅ Notificación marcada como leída');
      return response.data;
    } catch (error) {
      console.error('❌ Error al marcar notificación:', error);
      throw error;
    }
  },

  // Obtener actividad reciente del organizador
  async getOrganizerRecentActivity(limit: number = 10): Promise<DashboardResponse<UserActivity[]>> {
    try {
      console.log('🕐 Obteniendo actividad reciente...');
      const response = await api.get(`/api/dashboard/organizer/recent-activity?limit=${limit}`);
      console.log('✅ Actividad reciente obtenida:', response.data.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener actividad reciente:', error);
      throw error;
    }
  },

  // ===== MÉTODOS FUTUROS PARA ESCALABILIDAD =====

  // Dashboard del Admin
  async getAdminStats(): Promise<DashboardResponse<any>> {
    try {
      console.log('📊 Obteniendo estadísticas del admin...');
      const response = await api.get('/api/dashboard/admin/stats');
      console.log('✅ Estadísticas del admin obtenidas');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estadísticas del admin:', error);
      throw error;
    }
  },

  async getSystemHealth(): Promise<DashboardResponse<any>> {
    try {
      console.log('🏥 Obteniendo estado del sistema...');
      const response = await api.get('/api/dashboard/admin/system-health');
      console.log('✅ Estado del sistema obtenido');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener estado del sistema:', error);
      throw error;
    }
  },

  // Dashboard del Usuario
  async getUserSummary(): Promise<DashboardResponse<any>> {
    try {
      console.log('👤 Obteniendo resumen del usuario...');
      const response = await api.get('/api/dashboard/user/summary');
      console.log('✅ Resumen del usuario obtenido');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener resumen del usuario:', error);
      throw error;
    }
  },

  // ===== UTILIDADES =====

  // Formatear tipo de actividad para mostrar
  formatActivityType(activityType: string): string {
    const activityLabels: Record<string, string> = {
      'event_created': 'Evento creado',
      'event_updated': 'Evento actualizado',
      'event_deleted': 'Evento eliminado',
      'event_registered': 'Registro a evento',
      'event_cancelled': 'Registro cancelado',
      'event_attended': 'Asistencia marcada',
      'certificate_issued': 'Constancia emitida',
      'certificate_downloaded': 'Constancia descargada',
      'profile_updated': 'Perfil actualizado',
      'password_changed': 'Contraseña cambiada',
      'email_updated': 'Email actualizado'
    };

    return activityLabels[activityType] || activityType;
  },

  // Formatear tipo de notificación
  formatNotificationType(type: string): { icon: string; color: string } {
    const typeConfig: Record<string, { icon: string; color: string }> = {
      'event': { icon: '📅', color: 'blue' },
      'certificate': { icon: '🏆', color: 'green' },
      'reminder': { icon: '⏰', color: 'yellow' },
      'update': { icon: '📢', color: 'purple' },
      'warning': { icon: '⚠️', color: 'orange' },
      'error': { icon: '❌', color: 'red' },
      'success': { icon: '✅', color: 'green' }
    };

    return typeConfig[type] || { icon: '📝', color: 'gray' };
  },

  // Calcular tiempo relativo
  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    
    return date.toLocaleDateString('es-ES');
  }
};

export default dashboardService;