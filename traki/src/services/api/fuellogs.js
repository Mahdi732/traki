import { api } from '../api.js';

// Drivers can create a fuel log; admins can list all
export const createFuelLogRequestHandler = async (payload) => {
  return await api.post('/fuellogs', payload);
};

export const getFuelLogsRequestHandler = async () => {
  return await api.get('/fuellogs');
};

export const getFuelLogByIdRequestHandler = async (id) => {
  return await api.get(`/fuellogs/${id}`);
};

export const deleteFuelLogRequestHandler = async (id) => {
  return await api.delete(`/fuellogs/${id}`);
};
