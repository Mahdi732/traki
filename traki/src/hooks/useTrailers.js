import { useState, useEffect } from 'react';
import {
  getTrailersRequestHandler,
  createTrailerRequestHandler,
  getTrailerByIdRequestHandler,
  updateTrailerRequestHandler,
  deleteTrailerRequestHandler,
} from '../services/api/trailers.js';

export function useTrailers() {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrailers();
  }, []);

  const loadTrailers = async () => {
    try {
      setLoading(true);
      const res = await getTrailersRequestHandler();
      setTrailers(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load trailers');
    } finally {
      setLoading(false);
    }
  };

  const createTrailer = async (payload) => {
    try {
      setLoading(true);
      const res = await createTrailerRequestHandler(payload);
      setTrailers((t) => [...t, res.data]);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrailer = async (id, updates) => {
    try {
      setLoading(true);
      const res = await updateTrailerRequestHandler(id, updates);
      setTrailers((t) => t.map(item => item._id === id ? res.data : item));
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrailer = async (id) => {
    try {
      setLoading(true);
      await deleteTrailerRequestHandler(id);
      setTrailers((t) => t.filter(item => item._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trailers,
    loading,
    error,
    loadTrailers,
    createTrailer,
    updateTrailer,
    deleteTrailer,
  };
}
