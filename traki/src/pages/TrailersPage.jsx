import { useState } from 'react';
import { useTrailers } from '../hooks/useTrailers.js';

export function TrailersPage() {
  const { trailers, loading, error, createTrailer, deleteTrailer } = useTrailers();
  const [form, setForm] = useState({ plateNumber: '', make: '', model: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrailer(form);
      setForm({ plateNumber: '', make: '', model: '' });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Trailers</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2 max-w-md">
        <input value={form.plateNumber} onChange={e=>setForm({...form,plateNumber:e.target.value})} placeholder="Plate" className="w-full p-2 border rounded" />
        <input value={form.make} onChange={e=>setForm({...form,make:e.target.value})} placeholder="Make" className="w-full p-2 border rounded" />
        <input value={form.model} onChange={e=>setForm({...form,model:e.target.value})} placeholder="Model" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {trailers.map(t => (
            <div key={t._id} className="p-3 bg-white rounded shadow flex justify-between">
              <div>
                <div className="font-medium">{t.plateNumber}</div>
                <div className="text-sm text-gray-500">{t.make} {t.model}</div>
              </div>
              <div>
                <button onClick={()=>deleteTrailer(t._id)} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrailersPage;
