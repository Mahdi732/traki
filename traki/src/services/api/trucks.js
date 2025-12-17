import { api } from '../api.js';

// Get all trucks
export const getTrucksRequestHandler = async () => {
  return await api.get('/trucks');
};

// Create a new truck
export const createTruckRequestHandler = async (truckData) => {
  return await api.post('/trucks', {
    plateNumber: truckData.plateNumber,
    vin: truckData.vin,
    make: truckData.make,
    model: truckData.model,
    year: truckData.year,
    capacity: truckData.capacity,
    status: truckData.status || 'ACTIVE',
  });
};

// Get single truck by ID
export const getTruckByIdRequestHandler = async (id) => {
  return await api.get(`/trucks/${id}`);
};

// Update truck
export const updateTruckRequestHandler = async (id, updates) => {
  return await api.put(`/trucks/${id}`, updates);
};

// Delete truck
export const deleteTruckRequestHandler = async (id) => {
  return await api.delete(`/trucks/${id}`);
};
