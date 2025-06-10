// src/hooks/useAttendees.ts
import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  attendeeService,
  type Attendee,
  type AttendeeFilters,
  type UserSearchResult,
  type AddAttendeeData,
  type UpdateAttendeeData,
  type CommunicationData,
  type BulkActionData
} from '../services/attendee.service';
import { authUtils } from '../utils/auth.utils';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface AttendanceStatistics {
  total: number;
  registered: number;
  confirmed: number;
  attended: number;
  absent: number;
  cancelled: number;
}

interface UseAttendeesState {
  // Datos principales
  attendees: Attendee[];
  statistics: AttendanceStatistics | null;
  pagination: PaginationInfo | null;
  
  // Búsqueda de usuarios
  userSearchResults: UserSearchResult[];
  selectedUser: UserSearchResult | null;
  
  // Estados de carga
  loading: boolean;
  userSearchLoading: boolean;
  addingAttendee: boolean;
  updatingAttendee: boolean;
  removingAttendee: boolean;
  sendingCommunication: boolean;
  performingBulkAction: boolean;
  exporting: boolean;
  
  // Estados de error
  error: string | null;
  userSearchError: string | null;
  
  // Estados de éxito
  success: boolean;
  lastOperationMessage: string | null;
}

interface UseAttendeesActions {
  // CRUD básico
  loadAttendees: (eventId?: number, filters?: AttendeeFilters) => Promise<void>;
  addAttendee: (data: AddAttendeeData) => Promise<boolean>;
  updateAttendee: (attendeeId: number, data: UpdateAttendeeData) => Promise<boolean>;
  removeAttendee: (attendeeId: number, reason?: string) => Promise<boolean>;
  
  // Búsqueda de usuarios
  searchUsers: (query: string) => Promise<void>;
  getUserById: (userId: number) => Promise<UserSearchResult | null>;
  selectUser: (user: UserSearchResult | null) => void;
  clearUserSearch: () => void;
  
  // Comunicaciones
  sendCommunication: (data: CommunicationData) => Promise<boolean>;
  
  // Acciones masivas
  performBulkAction: (data: BulkActionData) => Promise<boolean>;
  
  // Exportación
  exportAttendees: (eventId: number, format?: 'csv' | 'excel', filters?: AttendeeFilters) => Promise<string | null>;
  
  // Check-in/Check-out
  checkInAttendee: (attendeeId: number) => Promise<boolean>;
  checkOutAttendee: (attendeeId: number) => Promise<boolean>;
  
  // Utilidades
  clearError: () => void;
  clearSuccess: () => void;
  refetch: () => Promise<void>;
  reset: () => void;
  
  // Paginación
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  
  // Filtros
  setCurrentFilters: (filters: AttendeeFilters) => void;
}

export type UseAttendeesReturn = UseAttendeesState & UseAttendeesActions;

interface UseAttendeesOptions {
  eventId?: number;
  initialFilters?: AttendeeFilters;
  autoLoad?: boolean;
}

export const useAttendees = (options: UseAttendeesOptions = {}): UseAttendeesReturn => {
  const {
    eventId,
    initialFilters = { page: 1, limit: 10 },
    autoLoad = false
  } = options;

  // Estado principal
  const [state, setState] = useState<UseAttendeesState>({
    attendees: [],
    statistics: null,
    pagination: null,
    userSearchResults: [],
    selectedUser: null,
    loading: false,
    userSearchLoading: false,
    addingAttendee: false,
    updatingAttendee: false,
    removingAttendee: false,
    sendingCommunication: false,
    performingBulkAction: false,
    exporting: false,
    error: null,
    userSearchError: null,
    success: false,
    lastOperationMessage: null,
  });

  // Filtros actuales
  const [currentFilters, setCurrentFilters] = useState<AttendeeFilters>({
    ...initialFilters,
    ...(eventId && { eventId })
  });

  // Función para manejar errores
  const handleError = useCallback((error: any, operation: string = 'operación') => {
    console.error(`❌ Hook Attendees: Error en ${operation}:`, error);
    const errorMessage = authUtils.formatAPIError(error);
    setState(prev => ({
      ...prev,
      loading: false,
      addingAttendee: false,
      updatingAttendee: false,
      removingAttendee: false,
      sendingCommunication: false,
      performingBulkAction: false,
      exporting: false,
      error: errorMessage,
    }));
    return errorMessage;
  }, []);

  // Función para manejar errores de búsqueda de usuarios
  const handleUserSearchError = useCallback((error: any) => {
    console.error('❌ Hook Attendees: Error en búsqueda de usuarios:', error);
    const errorMessage = authUtils.formatAPIError(error);
    setState(prev => ({
      ...prev,
      userSearchLoading: false,
      userSearchError: errorMessage,
    }));
    return errorMessage;
  }, []);

  // Cargar asistentes
  const loadAttendees = useCallback(async (targetEventId?: number, filters: AttendeeFilters = {}): Promise<void> => {
    const mergedFilters = { ...currentFilters, ...filters };
    if (targetEventId) mergedFilters.eventId = targetEventId;
    
    setCurrentFilters(mergedFilters);
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('👥 Hook: Cargando asistentes con filtros:', mergedFilters);
      
      const response = mergedFilters.eventId 
        ? await attendeeService.getEventAttendees(mergedFilters.eventId, mergedFilters)
        : await attendeeService.getAttendees(mergedFilters);
      
      setState(prev => ({
        ...prev,
        loading: false,
        attendees: response.data.attendees,
        statistics: response.data.statistics,
        pagination: response.data.pagination,
      }));
      
      console.log('✅ Hook: Asistentes cargados:', response.data.attendees.length);
    } catch (err: any) {
      handleError(err, 'cargar asistentes');
    }
  }, [currentFilters, handleError]);

  // Buscar usuarios
  const searchUsers = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, userSearchResults: [], userSearchError: null }));
      return;
    }

    setState(prev => ({ ...prev, userSearchLoading: true, userSearchError: null }));

    try {
      console.log('🔍 Hook: Buscando usuarios:', query);
      const response = await attendeeService.searchUsers(query);
      
      setState(prev => ({
        ...prev,
        userSearchLoading: false,
        userSearchResults: response.data,
      }));
      
      console.log('✅ Hook: Usuarios encontrados:', response.data.length);
    } catch (err: any) {
      handleUserSearchError(err);
    }
  }, [handleUserSearchError]);

  // Obtener usuario por ID
  const getUserById = useCallback(async (userId: number): Promise<UserSearchResult | null> => {
    setState(prev => ({ ...prev, userSearchLoading: true, userSearchError: null }));

    try {
      console.log('👤 Hook: Obteniendo usuario por ID:', userId);
      const response = await attendeeService.getUserById(userId);
      
      setState(prev => ({
        ...prev,
        userSearchLoading: false,
        selectedUser: response.data,
      }));
      
      console.log('✅ Hook: Usuario obtenido');
      return response.data;
    } catch (err: any) {
      handleUserSearchError(err);
      return null;
    }
  }, [handleUserSearchError]);

  // Seleccionar usuario
  const selectUser = useCallback((user: UserSearchResult | null) => {
    setState(prev => ({ ...prev, selectedUser: user }));
  }, []);

  // Limpiar búsqueda de usuarios
  const clearUserSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      userSearchResults: [],
      selectedUser: null,
      userSearchError: null,
    }));
  }, []);

  // Agregar asistente
  const addAttendee = useCallback(async (data: AddAttendeeData): Promise<boolean> => {
    setState(prev => ({ ...prev, addingAttendee: true, error: null, success: false }));

    try {
      console.log('➕ Hook: Agregando asistente:', data);
      const response = await attendeeService.addAttendee(data);
      
      setState(prev => ({
        ...prev,
        addingAttendee: false,
        success: true,
        lastOperationMessage: response.message,
        attendees: [response.data, ...prev.attendees],
        selectedUser: null, // Limpiar usuario seleccionado
      }));
      
      console.log('✅ Hook: Asistente agregado');
      return true;
    } catch (err: any) {
      handleError(err, 'agregar asistente');
      return false;
    }
  }, [handleError]);

  // Actualizar asistente
  const updateAttendee = useCallback(async (attendeeId: number, data: UpdateAttendeeData): Promise<boolean> => {
    setState(prev => ({ ...prev, updatingAttendee: true, error: null, success: false }));

    try {
      console.log('📝 Hook: Actualizando asistente:', attendeeId, data);
      const response = await attendeeService.updateAttendee(attendeeId, data);
      
      setState(prev => ({
        ...prev,
        updatingAttendee: false,
        success: true,
        lastOperationMessage: response.message,
        attendees: prev.attendees.map(attendee =>
          attendee.id === attendeeId ? response.data : attendee
        ),
      }));
      
      console.log('✅ Hook: Asistente actualizado');
      return true;
    } catch (err: any) {
      handleError(err, 'actualizar asistente');
      return false;
    }
  }, [handleError]);

  // Eliminar asistente
  const removeAttendee = useCallback(async (attendeeId: number, reason?: string): Promise<boolean> => {
    setState(prev => ({ ...prev, removingAttendee: true, error: null, success: false }));

    try {
      console.log('🗑️ Hook: Eliminando asistente:', attendeeId);
      const response = await attendeeService.removeAttendee(attendeeId, reason);
      
      setState(prev => ({
        ...prev,
        removingAttendee: false,
        success: true,
        lastOperationMessage: response.message,
        attendees: prev.attendees.filter(attendee => attendee.id !== attendeeId),
      }));
      
      console.log('✅ Hook: Asistente eliminado');
      return true;
    } catch (err: any) {
      handleError(err, 'eliminar asistente');
      return false;
    }
  }, [handleError]);

  // Enviar comunicación
  const sendCommunication = useCallback(async (data: CommunicationData): Promise<boolean> => {
    setState(prev => ({ ...prev, sendingCommunication: true, error: null, success: false }));

    try {
      console.log('📧 Hook: Enviando comunicación a asistentes:', data.attendeeIds.length);
      const response = await attendeeService.sendCommunication(data);
      
      setState(prev => ({
        ...prev,
        sendingCommunication: false,
        success: true,
        lastOperationMessage: response.message,
      }));
      
      console.log('✅ Hook: Comunicación enviada');
      return true;
    } catch (err: any) {
      handleError(err, 'enviar comunicación');
      return false;
    }
  }, [handleError]);

  // Acción masiva
  const performBulkAction = useCallback(async (data: BulkActionData): Promise<boolean> => {
    setState(prev => ({ ...prev, performingBulkAction: true, error: null, success: false }));

    try {
      console.log('📋 Hook: Ejecutando acción masiva:', data.action);
      const response = await attendeeService.bulkAction(data);
      
      setState(prev => ({
        ...prev,
        performingBulkAction: false,
        success: true,
        lastOperationMessage: response.message,
      }));
      
      // Recargar datos después de acción masiva
      await loadAttendees();
      
      console.log('✅ Hook: Acción masiva completada');
      return true;
    } catch (err: any) {
      handleError(err, 'acción masiva');
      return false;
    }
  }, [handleError, loadAttendees]);

  // Exportar asistentes
  const exportAttendees = useCallback(async (targetEventId: number, format: 'csv' | 'excel' = 'csv', filters?: AttendeeFilters): Promise<string | null> => {
    setState(prev => ({ ...prev, exporting: true, error: null }));

    try {
      console.log('📊 Hook: Exportando asistentes del evento:', targetEventId);
      const response = await attendeeService.exportAttendees(targetEventId, format, filters);
      
      setState(prev => ({
        ...prev,
        exporting: false,
        success: true,
        lastOperationMessage: 'Exportación iniciada exitosamente',
      }));
      
      console.log('✅ Hook: Exportación iniciada');
      return response.data.downloadUrl;
    } catch (err: any) {
      handleError(err, 'exportar asistentes');
      return null;
    }
  }, [handleError]);

  // Check-in de asistente
  const checkInAttendee = useCallback(async (attendeeId: number): Promise<boolean> => {
    setState(prev => ({ ...prev, updatingAttendee: true, error: null }));

    try {
      console.log('✅ Hook: Marcando entrada del asistente:', attendeeId);
      const response = await attendeeService.checkInAttendee(attendeeId);
      
      setState(prev => ({
        ...prev,
        updatingAttendee: false,
        success: true,
        lastOperationMessage: response.message,
        attendees: prev.attendees.map(attendee =>
          attendee.id === attendeeId 
            ? { ...attendee, status: 'attended', attendanceCheckedIn: response.data.checkedInAt }
            : attendee
        ),
      }));
      
      console.log('✅ Hook: Entrada marcada');
      return true;
    } catch (err: any) {
      handleError(err, 'marcar entrada');
      return false;
    }
  }, [handleError]);

  // Check-out de asistente
  const checkOutAttendee = useCallback(async (attendeeId: number): Promise<boolean> => {
    setState(prev => ({ ...prev, updatingAttendee: true, error: null }));

    try {
      console.log('🚪 Hook: Marcando salida del asistente:', attendeeId);
      const response = await attendeeService.checkOutAttendee(attendeeId);
      
      setState(prev => ({
        ...prev,
        updatingAttendee: false,
        success: true,
        lastOperationMessage: response.message,
        attendees: prev.attendees.map(attendee =>
          attendee.id === attendeeId 
            ? { ...attendee, attendanceCheckedOut: response.data.checkedOutAt }
            : attendee
        ),
      }));
      
      console.log('✅ Hook: Salida marcada');
      return true;
    } catch (err: any) {
      handleError(err, 'marcar salida');
      return false;
    }
  }, [handleError]);

  // Utilidades
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null, userSearchError: null }));
  }, []);

  const clearSuccess = useCallback(() => {
    setState(prev => ({ ...prev, success: false, lastOperationMessage: null }));
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await loadAttendees();
  }, [loadAttendees]);

  const reset = useCallback(() => {
    setState({
      attendees: [],
      statistics: null,
      pagination: null,
      userSearchResults: [],
      selectedUser: null,
      loading: false,
      userSearchLoading: false,
      addingAttendee: false,
      updatingAttendee: false,
      removingAttendee: false,
      sendingCommunication: false,
      performingBulkAction: false,
      exporting: false,
      error: null,
      userSearchError: null,
      success: false,
      lastOperationMessage: null,
    });
    setCurrentFilters(initialFilters);
  }, [initialFilters]);

  // Paginación
  const nextPage = useCallback(async (): Promise<void> => {
    if (state.pagination?.hasNext) {
      await loadAttendees(undefined, { ...currentFilters, page: state.pagination.page + 1 });
    }
  }, [loadAttendees, currentFilters, state.pagination]);

  const prevPage = useCallback(async (): Promise<void> => {
    if (state.pagination?.hasPrev) {
      await loadAttendees(undefined, { ...currentFilters, page: state.pagination.page - 1 });
    }
  }, [loadAttendees, currentFilters, state.pagination]);

  const goToPage = useCallback(async (page: number): Promise<void> => {
    if (page >= 1 && page <= (state.pagination?.pages || 1)) {
      await loadAttendees(undefined, { ...currentFilters, page });
    }
  }, [loadAttendees, currentFilters, state.pagination]);

  // Efecto para carga inicial
  useEffect(() => {
    if (autoLoad) {
      loadAttendees(eventId, initialFilters);
    }
  }, [autoLoad]); // Solo en mount

  // Estadísticas computadas
  const computedStats = useMemo(() => {
    if (!state.statistics) return null;
    
    return {
      ...state.statistics,
      attendanceRate: state.statistics.total > 0 
        ? Math.round((state.statistics.attended / state.statistics.total) * 100)
        : 0,
      confirmationRate: state.statistics.total > 0 
        ? Math.round(((state.statistics.confirmed + state.statistics.attended) / state.statistics.total) * 100)
        : 0,
    };
  }, [state.statistics]);

  return {
    // Estado
    ...state,
    statistics: computedStats,
    
    // Acciones
    loadAttendees,
    addAttendee,
    updateAttendee,
    removeAttendee,
    searchUsers,
    getUserById,
    selectUser,
    clearUserSearch,
    sendCommunication,
    performBulkAction,
    exportAttendees,
    checkInAttendee,
    checkOutAttendee,
    clearError,
    clearSuccess,
    refetch,
    reset,
    nextPage,
    prevPage,
    goToPage,
    setCurrentFilters,
  };
};

export default useAttendees;