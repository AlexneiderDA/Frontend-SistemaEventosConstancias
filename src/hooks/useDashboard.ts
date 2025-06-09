// src/hooks/useDashboard.ts
import { useState, useCallback, useEffect } from 'react';
import { 
  dashboardService, 
  DashboardStats, 
  UpcomingEvent, 
  DashboardNotification, 
  UserActivity,
  NotificationsResponse
} from '../services/dashboard.service';
import { authUtils } from '../utils/auth.utils';

interface UseDashboardState {
  // Datos
  stats: DashboardStats | null;
  upcomingEvents: UpcomingEvent[];
  notifications: DashboardNotification[];
  unreadNotificationsCount: number;
  recentActivity: UserActivity[];
  
  // Estados de carga
  statsLoading: boolean;
  eventsLoading: boolean;
  notificationsLoading: boolean;
  activityLoading: boolean;
  
  // Estados de error
  statsError: string | null;
  eventsError: string | null;
  notificationsError: string | null;
  activityError: string | null;
  
  // Estados de operaciones
  markingAsRead: boolean;
  
  // Metadata
  lastUpdated: Date | null;
}

interface UseDashboardActions {
  // Cargar datos
  loadStats: () => Promise<void>;
  loadUpcomingEvents: (limit?: number) => Promise<void>;
  loadNotifications: (limit?: number, unreadOnly?: boolean) => Promise<void>;
  loadRecentActivity: (limit?: number) => Promise<void>;
  loadAllData: () => Promise<void>;
  
  // Acciones de notificaciones
  markNotificationAsRead: (notificationId: number) => Promise<boolean>;
  markAllNotificationsAsRead: () => Promise<boolean>;
  
  // Utilidades
  refreshData: () => Promise<void>;
  clearErrors: () => void;
  clearData: () => void;
  
  // Helpers para UI
  getStatTrend: (statType: 'events' | 'registrations') => { value: number; isPositive: boolean; text: string };
  getEventStatusInfo: (event: UpcomingEvent) => { color: string; label: string; urgent: boolean };
  getNotificationIcon: (notification: DashboardNotification) => { icon: string; color: string };
}

export type UseDashboardReturn = UseDashboardState & UseDashboardActions;

interface UseDashboardOptions {
  autoLoad?: boolean;
  refreshInterval?: number; // en milisegundos
  role?: 'organizer' | 'admin' | 'user';
}

export const useDashboard = (options: UseDashboardOptions = {}): UseDashboardReturn => {
  const {
    autoLoad = true,
    refreshInterval,
    role = 'organizer'
  } = options;

  // Estado principal
  const [state, setState] = useState<UseDashboardState>({
    stats: null,
    upcomingEvents: [],
    notifications: [],
    unreadNotificationsCount: 0,
    recentActivity: [],
    statsLoading: false,
    eventsLoading: false,
    notificationsLoading: false,
    activityLoading: false,
    statsError: null,
    eventsError: null,
    notificationsError: null,
    activityError: null,
    markingAsRead: false,
    lastUpdated: null,
  });

  // Función para manejar errores
  const handleError = useCallback((error: any, type: 'stats' | 'events' | 'notifications' | 'activity') => {
    console.error(`❌ Hook Dashboard: Error en ${type}:`, error);
    const errorMessage = authUtils.formatAPIError(error);
    
    setState(prev => ({
      ...prev,
      [`${type}Loading`]: false,
      [`${type}Error`]: errorMessage,
    }));
    
    return errorMessage;
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, statsLoading: true, statsError: null }));
    
    try {
      console.log('📊 Hook: Cargando estadísticas...');
      const response = await dashboardService.getOrganizerStats();
      
      setState(prev => ({
        ...prev,
        statsLoading: false,
        stats: response.data,
        lastUpdated: new Date(),
      }));
      
      console.log('✅ Hook: Estadísticas cargadas');
    } catch (error: any) {
      handleError(error, 'stats');
    }
  }, [handleError]);

  // Cargar próximos eventos
  const loadUpcomingEvents = useCallback(async (limit: number = 5): Promise<void> => {
    setState(prev => ({ ...prev, eventsLoading: true, eventsError: null }));
    
    try {
      console.log('📅 Hook: Cargando próximos eventos...');
      const response = await dashboardService.getOrganizerUpcomingEvents(limit);
      
      setState(prev => ({
        ...prev,
        eventsLoading: false,
        upcomingEvents: response.data,
      }));
      
      console.log('✅ Hook: Próximos eventos cargados:', response.data.length);
    } catch (error: any) {
      handleError(error, 'events');
    }
  }, [handleError]);

  // Cargar notificaciones
  const loadNotifications = useCallback(async (limit: number = 10, unreadOnly: boolean = false): Promise<void> => {
    setState(prev => ({ ...prev, notificationsLoading: true, notificationsError: null }));
    
    try {
      console.log('🔔 Hook: Cargando notificaciones...');
      const response = await dashboardService.getOrganizerNotifications(limit, unreadOnly);
      
      setState(prev => ({
        ...prev,
        notificationsLoading: false,
        notifications: response.data.notifications,
        unreadNotificationsCount: response.data.unreadCount,
      }));
      
      console.log('✅ Hook: Notificaciones cargadas:', response.data.notifications.length);
    } catch (error: any) {
      handleError(error, 'notifications');
    }
  }, [handleError]);

  // Cargar actividad reciente
  const loadRecentActivity = useCallback(async (limit: number = 10): Promise<void> => {
    setState(prev => ({ ...prev, activityLoading: true, activityError: null }));
    
    try {
      console.log('🕐 Hook: Cargando actividad reciente...');
      const response = await dashboardService.getOrganizerRecentActivity(limit);
      
      setState(prev => ({
        ...prev,
        activityLoading: false,
        recentActivity: response.data,
      }));
      
      console.log('✅ Hook: Actividad reciente cargada:', response.data.length);
    } catch (error: any) {
      handleError(error, 'activity');
    }
  }, [handleError]);

  // Cargar todos los datos
  const loadAllData = useCallback(async (): Promise<void> => {
    console.log('🔄 Hook: Cargando todos los datos del dashboard...');
    await Promise.all([
      loadStats(),
      loadUpcomingEvents(),
      loadNotifications(),
      loadRecentActivity(),
    ]);
    console.log('✅ Hook: Todos los datos cargados');
  }, [loadStats, loadUpcomingEvents, loadNotifications, loadRecentActivity]);

  // Marcar notificación como leída
  const markNotificationAsRead = useCallback(async (notificationId: number): Promise<boolean> => {
    setState(prev => ({ ...prev, markingAsRead: true }));
    
    try {
      console.log('✅ Hook: Marcando notificación como leída:', notificationId);
      await dashboardService.markNotificationAsRead(notificationId);
      
      setState(prev => ({
        ...prev,
        markingAsRead: false,
        notifications: prev.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        ),
        unreadNotificationsCount: Math.max(0, prev.unreadNotificationsCount - 1),
      }));
      
      console.log('✅ Hook: Notificación marcada como leída');
      return true;
    } catch (error: any) {
      console.error('❌ Hook: Error al marcar notificación como leída:', error);
      setState(prev => ({ ...prev, markingAsRead: false }));
      return false;
    }
  }, []);

  // Marcar todas las notificaciones como leídas
  const markAllNotificationsAsRead = useCallback(async (): Promise<boolean> => {
    const unreadNotifications = state.notifications.filter(n => !n.isRead);
    
    if (unreadNotifications.length === 0) return true;
    
    try {
      console.log('✅ Hook: Marcando todas las notificaciones como leídas...');
      
      // Marcar todas en paralelo
      await Promise.all(
        unreadNotifications.map(notification =>
          dashboardService.markNotificationAsRead(notification.id)
        )
      );
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification => ({
          ...notification,
          isRead: true,
          readAt: notification.readAt || new Date().toISOString()
        })),
        unreadNotificationsCount: 0,
      }));
      
      console.log('✅ Hook: Todas las notificaciones marcadas como leídas');
      return true;
    } catch (error: any) {
      console.error('❌ Hook: Error al marcar todas las notificaciones:', error);
      return false;
    }
  }, [state.notifications]);

  // Refrescar datos
  const refreshData = useCallback(async (): Promise<void> => {
    console.log('🔄 Hook: Refrescando datos del dashboard...');
    await loadAllData();
  }, [loadAllData]);

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      statsError: null,
      eventsError: null,
      notificationsError: null,
      activityError: null,
    }));
  }, []);

  // Limpiar datos
  const clearData = useCallback(() => {
    setState({
      stats: null,
      upcomingEvents: [],
      notifications: [],
      unreadNotificationsCount: 0,
      recentActivity: [],
      statsLoading: false,
      eventsLoading: false,
      notificationsLoading: false,
      activityLoading: false,
      statsError: null,
      eventsError: null,
      notificationsError: null,
      activityError: null,
      markingAsRead: false,
      lastUpdated: null,
    });
  }, []);

  // Helpers para UI
  const getStatTrend = useCallback((statType: 'events' | 'registrations') => {
    if (!state.stats) return { value: 0, isPositive: true, text: 'No hay datos' };
    
    const trend = state.stats[statType].trend;
    const isPositive = trend >= 0;
    const absValue = Math.abs(trend);
    
    return {
      value: trend,
      isPositive,
      text: `${isPositive ? '+' : ''}${trend}% vs mes anterior`
    };
  }, [state.stats]);

  const getEventStatusInfo = useCallback((event: UpcomingEvent) => {
    switch (event.status) {
      case 'very-soon':
        return { color: 'red', label: 'Muy pronto', urgent: true };
      case 'soon':
        return { color: 'orange', label: 'Próximamente', urgent: true };
      default:
        return { color: 'blue', label: 'Programado', urgent: false };
    }
  }, []);

  const getNotificationIcon = useCallback((notification: DashboardNotification) => {
    return dashboardService.formatNotificationType(notification.type);
  }, []);

  // Efecto para carga inicial
  useEffect(() => {
    if (autoLoad) {
      loadAllData();
    }
  }, [autoLoad]); // Solo en mount

  // Efecto para refresh automático
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      console.log('🔄 Hook: Refrescando datos automáticamente...');
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, refreshData]);

  return {
    // Estado
    ...state,
    
    // Acciones
    loadStats,
    loadUpcomingEvents,
    loadNotifications,
    loadRecentActivity,
    loadAllData,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshData,
    clearErrors,
    clearData,
    
    // Helpers
    getStatTrend,
    getEventStatusInfo,
    getNotificationIcon,
  };
};

export default useDashboard;