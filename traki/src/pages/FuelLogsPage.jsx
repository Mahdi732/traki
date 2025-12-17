import { useState } from 'react';
import { useFuelLogs } from '../hooks/useFuelLogs.js';

export function FuelLogsPage() {
  const { logs, loading, createLog, removeLog } = useFuelLogs();
  const [form, setForm] = useState({ trip: '', liters: '', odometer: '', notes: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await createLog(form); setForm({ trip: '', liters: '', odometer: '', notes: '' }); } catch(err){ console.error(err); }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Fuel Logs</h1>
      <form onSubmit={handleSubmit} className="mb-6 max-w-md space-y-2">
        <input value={form.trip} onChange={e=>setForm({...form,trip:e.target.value})} placeholder="Trip ID" className="w-full p-2 border rounded" />
        <input value={form.liters} onChange={e=>setForm({...form,liters:e.target.value})} placeholder="Liters" className="w-full p-2 border rounded" />
        <input value={form.odometer} onChange={e=>setForm({...form,odometer:e.target.value})} placeholder="Odometer" className="w-full p-2 border rounded" />
        <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {logs.map(l => (
            <div key={l._id} className="p-3 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-medium">Trip: {l.trip}</div>
                <div className="text-sm text-gray-500">{l.liters} L • {l.odometer} km</div>
              </div>
              <div>
                <button onClick={()=>removeLog(l._id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FuelLogsPage;
