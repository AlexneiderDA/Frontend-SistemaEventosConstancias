// src/hooks/useEvents.ts
import { useState, useCallback, useEffect } from 'react';
import { 
  eventService, 
  type CreateEventData, 
  type Event, 
  type Category, 
  type EventFilters 
} from '../services/event.service';
import { authUtils } from '../utils/auth.utils';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UseEventsState {
  // Datos
  events: Event[];
  categories: Category[];
  currentEvent: Event | null;
  pagination: PaginationInfo | null;
  
  // Estados de UI
  loading: boolean;
  error: string | null;
  success: boolean;
  
  // Estados específicos para operaciones
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  duplicating: boolean;
}

interface UseEventsActions {
  // CRUD Básico
  createEvent: (data: CreateEventData) => Promise<Event | null>;
  getEvents: (filters?: EventFilters) => Promise<void>;
  getEventById: (id: number) => Promise<Event | null>;
  updateEvent: (id: number, data: Partial<CreateEventData>) => Promise<Event | null>;
  deleteEvent: (id: number) => Promise<boolean>;
  duplicateEvent: (id: number) => Promise<Event | null>;
  
  // Operaciones adicionales
  loadCategories: () => Promise<void>;
  getFeaturedEvents: () => Promise<Event[]>;
  toggleFeatured: (id: number) => Promise<Event | null>;
  getEventStats: (id: number) => Promise<any>;
  
  // Utilidades
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
  refetch: () => Promise<void>;
  
  // Filtros y paginación
  setCurrentFilters: (filters: EventFilters) => void;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

export type UseEventsReturn = UseEventsState & UseEventsActions;

interface UseEventsOptions {
  initialFilters?: EventFilters;
  autoLoad?: boolean;
  loadCategories?: boolean;
}

export const useEvents = (options: UseEventsOptions = {}): UseEventsReturn => {
  const {
    initialFilters = { page: 1, limit: 10 },
    autoLoad = false,
    loadCategories: shouldLoadCategories = false
  } = options;

  // Estado principal
  const [state, setState] = useState<UseEventsState>({
    events: [],
    categories: [],
    currentEvent: null,
    pagination: null,
    loading: false,
    error: null,
    success: false,
    creating: false,
    updating: false,
    deleting: false,
    duplicating: false,
  });

  // Filtros actuales para paginación
  const [currentFilters, setCurrentFilters] = useState<EventFilters>(initialFilters);

  // Función para manejar errores de manera consistente
  const handleError = useCallback((error: any, operation: string = 'operación') => {
    console.error(`❌ Hook: Error en ${operation}:`, error);
    const errorMessage = authUtils.formatAPIError(error);
    setState(prev => ({
      ...prev,
      loading: false,
      creating: false,
      updating: false,
      deleting: false,
      duplicating: false,
      error: errorMessage,
    }));
    return errorMessage;
  }, []);

  // Funciones de utilidad
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSuccess = useCallback(() => {
    setState(prev => ({ ...prev, success: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      events: [],
      categories: [],
      currentEvent: null,
      pagination: null,
      loading: false,
      error: null,
      success: false,
      creating: false,
      updating: false,
      deleting: false,
      duplicating: false,
    });
    setCurrentFilters(initialFilters);
  }, [initialFilters]);

  // CRUD Operations
  const createEvent = useCallback(async (data: CreateEventData): Promise<Event | null> => {
    setState(prev => ({ ...prev, creating: true, error: null, success: false }));

    try {
      console.log('🎯 Hook: Creando evento...', data.title);
      const response = await eventService.createEvent(data);
      
      console.log('✅ Hook: Evento creado exitosamente');
      setState(prev => ({
        ...prev,
        creating: false,
        success: true,
        events: [response.data, ...prev.events],
      }));
      
      return response.data;
    } catch (err: any) {
      handleError(err, 'crear evento');
      return null;
    }
  }, [handleError]);

  const getEvents = useCallback(async (filters: EventFilters = {}): Promise<void> => {
    const mergedFilters = { ...currentFilters, ...filters };
    setCurrentFilters(mergedFilters);
    
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('📋 Hook: Obteniendo eventos con filtros:', mergedFilters);
      const response = await eventService.getEvents(mergedFilters);
      
      setState(prev => ({
        ...prev,
        loading: false,
        events: response.data.events,
        pagination: response.data.pagination,
      }));
      
      console.log('✅ Hook: Eventos obtenidos:', response.data.events.length);
    } catch (err: any) {
      handleError(err, 'obtener eventos');
    }
  }, [currentFilters, handleError]);

  const getEventById = useCallback(async (id: number): Promise<Event | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Hook: Obteniendo evento:', id);
      const response = await eventService.getEventById(id);
      
      setState(prev => ({
        ...prev,
        loading: false,
        currentEvent: response.data,
      }));
      
      console.log('✅ Hook: Evento obtenido');
      return response.data;
    } catch (err: any) {
      handleError(err, 'obtener evento');
      return null;
    }
  }, [handleError]);

  const updateEvent = useCallback(async (id: number, data: Partial<CreateEventData>): Promise<Event | null> => {
    setState(prev => ({ ...prev, updating: true, error: null, success: false }));

    try {
      console.log('📝 Hook: Actualizando evento:', id);
      const response = await eventService.updateEvent(id, data);
      
      setState(prev => ({
        ...prev,
        updating: false,
        success: true,
        events: prev.events.map(event => 
          event.id === id ? response.data : event
        ),
        currentEvent: prev.currentEvent?.id === id ? response.data : prev.currentEvent,
      }));
      
      console.log('✅ Hook: Evento actualizado');
      return response.data;
    } catch (err: any) {
      handleError(err, 'actualizar evento');
      return null;
    }
  }, [handleError]);

  const deleteEvent = useCallback(async (id: number): Promise<boolean> => {
    setState(prev => ({ ...prev, deleting: true, error: null, success: false }));

    try {
      console.log('🗑️ Hook: Eliminando evento:', id);
      await eventService.deleteEvent(id);
      
      setState(prev => ({
        ...prev,
        deleting: false,
        success: true,
        events: prev.events.filter(event => event.id !== id),
      }));
      
      console.log('✅ Hook: Evento eliminado');
      return true;
    } catch (err: any) {
      handleError(err, 'eliminar evento');
      return false;
    }
  }, [handleError]);

  const duplicateEvent = useCallback(async (id: number): Promise<Event | null> => {
    setState(prev => ({ ...prev, duplicating: true, error: null, success: false }));

    try {
      console.log('📋 Hook: Duplicando evento:', id);
      const response = await eventService.duplicateEvent(id);
      
      setState(prev => ({
        ...prev,
        duplicating: false,
        success: true,
        events: [response.data, ...prev.events],
      }));
      
      console.log('✅ Hook: Evento duplicado');
      return response.data;
    } catch (err: any) {
      handleError(err, 'duplicar evento');
      return null;
    }
  }, [handleError]);

  // Operaciones adicionales
  const loadCategories = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('📂 Hook: Cargando categorías...');
      const categoriesData = await eventService.getCategories();
      
      setState(prev => ({
        ...prev,
        loading: false,
        categories: categoriesData,
      }));
      
      console.log('✅ Hook: Categorías cargadas:', categoriesData.length);
    } catch (err: any) {
      handleError(err, 'cargar categorías');
    }
  }, [handleError]);

  const getFeaturedEvents = useCallback(async (): Promise<Event[]> => {
    try {
      console.log('⭐ Hook: Obteniendo eventos destacados...');
      const events = await eventService.getFeaturedEvents();
      console.log('✅ Hook: Eventos destacados obtenidos:', events.length);
      return events;
    } catch (err: any) {
      handleError(err, 'obtener eventos destacados');
      return [];
    }
  }, [handleError]);

  const toggleFeatured = useCallback(async (id: number): Promise<Event | null> => {
    setState(prev => ({ ...prev, updating: true, error: null, success: false }));

    try {
      console.log('⭐ Hook: Cambiando estado destacado:', id);
      const response = await eventService.toggleFeatured(id);
      
      setState(prev => ({
        ...prev,
        updating: false,
        success: true,
        events: prev.events.map(event => 
          event.id === id ? response.data : event
        ),
      }));
      
      console.log('✅ Hook: Estado destacado cambiado');
      return response.data;
    } catch (err: any) {
      handleError(err, 'cambiar estado destacado');
      return null;
    }
  }, [handleError]);

  const getEventStats = useCallback(async (id: number): Promise<any> => {
    try {
      console.log('📊 Hook: Obteniendo estadísticas:', id);
      const stats = await eventService.getEventStats(id);
      console.log('✅ Hook: Estadísticas obtenidas');
      return stats;
    } catch (err: any) {
      handleError(err, 'obtener estadísticas');
      return null;
    }
  }, [handleError]);

  // Funciones de paginación
  const refetch = useCallback(async (): Promise<void> => {
    await getEvents(currentFilters);
  }, [getEvents, currentFilters]);

  const nextPage = useCallback(async (): Promise<void> => {
    if (state.pagination?.hasNext) {
      await getEvents({ ...currentFilters, page: state.pagination.page + 1 });
    }
  }, [getEvents, currentFilters, state.pagination]);

  const prevPage = useCallback(async (): Promise<void> => {
    if (state.pagination?.hasPrev) {
      await getEvents({ ...currentFilters, page: state.pagination.page - 1 });
    }
  }, [getEvents, currentFilters, state.pagination]);

  const goToPage = useCallback(async (page: number): Promise<void> => {
    if (page >= 1 && page <= (state.pagination?.pages || 1)) {
      await getEvents({ ...currentFilters, page });
    }
  }, [getEvents, currentFilters, state.pagination]);

  // Efectos para carga inicial
  useEffect(() => {
    if (autoLoad) {
      getEvents(initialFilters);
    }
  }, [autoLoad]); // Solo en mount

  useEffect(() => {
    if (shouldLoadCategories) {
      loadCategories();
    }
  }, [shouldLoadCategories]); // Solo en mount

  return {
    // Estado
    ...state,
    pagination: state.pagination,
    
    // Acciones CRUD
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    
    // Operaciones adicionales
    loadCategories,
    getFeaturedEvents,
    toggleFeatured,
    getEventStats,
    
    // Utilidades
    clearError,
    clearSuccess,
    reset,
    refetch,
    
    // Filtros y paginación
    setCurrentFilters,
    nextPage,
    prevPage,
    goToPage,
  };
};

// Hook específico para un evento individual
export const useEvent = (id: number | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.getEventById(id);
      setEvent(response.data);
    } catch (err) {
      setError(authUtils.formatAPIError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
};

export default useEvents;