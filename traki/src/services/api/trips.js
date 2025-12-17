import { api } from '../api.js';

// Get all trips (admin only)
export const getTripsRequestHandler = async () => {
  return await api.get('/trips');
};

// Get my trips (driver only)
export const getMyTripsRequestHandler = async () => {
  return await api.get('/trips/my');
};

// Create a new trip (admin only)
export const createTripRequestHandler = async (tripData) => {
  return await api.post('/trips', {
    title: tripData.title,
    description: tripData.description,
    truck: tripData.truck,
    driver: tripData.driver,
    origin: tripData.origin,
    destination: tripData.destination,
    plannedStart: tripData.plannedStart,
    plannedEnd: tripData.plannedEnd,
    status: tripData.status || 'TO_DO',
  });
};

// Get single trip by ID
export const getTripByIdRequestHandler = async (id) => {
  return await api.get(`/trips/${id}`);
};

// Update trip
export const updateTripRequestHandler = async (id, updates) => {
  return await api.put(`/trips/${id}`, updates);
};

// Delete trip
export const deleteTripRequestHandler = async (id) => {
  return await api.delete(`/trips/${id}`);
};

// Download trip as PDF
export const downloadTripRequestHandler = async (id) => {
  return await api.get(`/trips/${id}/download`, { responseType: 'blob' });
};
