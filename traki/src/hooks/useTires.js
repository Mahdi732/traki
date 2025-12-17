import { useState, useEffect } from 'react';
import {
  getTiresRequestHandler,
  createTireRequestHandler,
  getTireByIdRequestHandler,
  updateTireRequestHandler,
  deleteTireRequestHandler,
} from '../services/api/tires.js';

export function useTires() {
  const [tires, setTires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadTires(); }, []);

  const loadTires = async () => {
    try {
      setLoading(true);
      const res = await getTiresRequestHandler();
      setTires(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load tires');
    } finally { setLoading(false); }
  };

  const createTire = async (payload) => {
    try {
      setLoading(true);
      const res = await createTireRequestHandler(payload);
      setTires((t) => [...t, res.data]);
      return res.data;
    } catch (err) { setError(err.message); throw err; } finally { setLoading(false); }
  };

  const updateTire = async (id, updates) => {
    try { setLoading(true); const res = await updateTireRequestHandler(id, updates); setTires((t)=>t.map(x=>x._id===id?res.data:x)); return res.data; } catch(err){ setError(err.message); throw err; } finally { setLoading(false); }
  };

  const deleteTire = async (id) => {
    try { setLoading(true); await deleteTireRequestHandler(id); setTires((t)=>t.filter(x=>x._id!==id)); } catch(err){ setError(err.message); throw err; } finally { setLoading(false); }
  };

  return { tires, loading, error, loadTires, createTire, updateTire, deleteTire };
}
