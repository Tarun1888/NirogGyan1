
import React, { createContext, useContext, useReducer } from 'react';

const AppointmentContext = createContext();

const initialState = {
  doctors: [],
  selectedDoctor: null,
  appointments: [],
  loading: false,
  error: null,
  searchQuery: ''
};

function appointmentReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload, loading: false };
    case 'SET_SELECTED_DOCTOR':
      return { ...state, selectedDoctor: action.payload, loading: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AppointmentProvider({ children }) {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setDoctors = (doctors) => {
    dispatch({ type: 'SET_DOCTORS', payload: doctors });
  };

  const setSelectedDoctor = (doctor) => {
    dispatch({ type: 'SET_SELECTED_DOCTOR', payload: doctor });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const addAppointment = (appointment) => {
    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    setDoctors,
    setSelectedDoctor,
    setSearchQuery,
    addAppointment,
    clearError
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
}

