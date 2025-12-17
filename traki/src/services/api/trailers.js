import { api } from '../api.js';

export const getTrailersRequestHandler = async () => {
  return await api.get('/trailers');
};

export const getTrailerByIdRequestHandler = async (id) => {
  return await api.get(`/trailers/${id}`);
};

export const createTrailerRequestHandler = async (payload) => {
  return await api.post('/trailers', payload);
};

export const updateTrailerRequestHandler = async (id, updates) => {
  return await api.put(`/trailers/${id}`, updates);
};

export const deleteTrailerRequestHandler = async (id) => {
  return await api.delete(`/trailers/${id}`);
};
