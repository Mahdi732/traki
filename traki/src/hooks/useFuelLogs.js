import { useState, useEffect } from 'react';
import {
  createFuelLogRequestHandler,
  getFuelLogsRequestHandler,
  getFuelLogByIdRequestHandler,
  deleteFuelLogRequestHandler,
} from '../services/api/fuellogs.js';

export function useFuelLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    try { setLoading(true); const res = await getFuelLogsRequestHandler(); setLogs(res.data || []); setError(null); } catch(err){ setError(err.message); } finally { setLoading(false); }
  };

  const createLog = async (payload) => {
    try { setLoading(true); const res = await createFuelLogRequestHandler(payload); setLogs((l)=>[...l, res.data]); return res.data; } catch(err){ setError(err.message); throw err; } finally { setLoading(false); }
  };

  const removeLog = async (id) => {
    try { setLoading(true); await deleteFuelLogRequestHandler(id); setLogs((l)=>l.filter(x=>x._id!==id)); } catch(err){ setError(err.message); throw err; } finally { setLoading(false); }
  };

  return { logs, loading, error, loadLogs, createLog, removeLog };
}
