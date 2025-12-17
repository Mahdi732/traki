import { api } from '../api.js';

// Get all drivers (admin)
export const getDriversRequestHandler = async () => {
  return await api.get('/drivers');
};

// Get single driver by id
export const getDriverByIdRequestHandler = async (id) => {
  return await api.get(`/drivers/${id}`);
};

// Create driver via auth/register endpoint
export const createDriverRequestHandler = async (name, email, password) => {
  return await api.post('/auth/register', { name, email, password, role: 'DRIVER' });
};
