import { useState } from 'react';
import { useTires } from '../hooks/useTires.js';

export function TiresPage() {
  const { tires, loading, createTire, deleteTire } = useTires();
  const [form, setForm] = useState({ serial: '', position: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await createTire(form); setForm({ serial: '', position: '' }); } catch(err){ console.error(err); }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Tires</h1>
      <form onSubmit={handleSubmit} className="mb-6 max-w-md space-y-2">
        <input value={form.serial} onChange={e=>setForm({...form,serial:e.target.value})} placeholder="Serial" className="w-full p-2 border rounded" />
        <input value={form.position} onChange={e=>setForm({...form,position:e.target.value})} placeholder="Position (e.g., front-left)" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {tires.map(t => (
            <div key={t._id} className="p-3 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-medium">{t.serial}</div>
                <div className="text-sm text-gray-500">{t.position}</div>
              </div>
              <div>
                <button onClick={()=>deleteTire(t._id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TiresPage;
