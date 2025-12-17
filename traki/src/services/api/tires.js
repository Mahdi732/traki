import { api } from '../api.js';

export const getTiresRequestHandler = async () => {
  return await api.get('/tires');
};

export const getTireByIdRequestHandler = async (id) => {
  return await api.get(`/tires/${id}`);
};

export const createTireRequestHandler = async (payload) => {
  return await api.post('/tires', payload);
};

export const updateTireRequestHandler = async (id, updates) => {
  return await api.put(`/tires/${id}`, updates);
};

export const deleteTireRequestHandler = async (id) => {
  return await api.delete(`/tires/${id}`);
};
