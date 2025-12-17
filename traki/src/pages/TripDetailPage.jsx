import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripByIdRequestHandler, downloadTripRequestHandler } from '../services/api/trips.js';
import { TripDetail } from '../components/trips/TripDetail.jsx';

export function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getTripByIdRequestHandler(id);
        if (mounted) setTrip(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load trip');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await downloadTripRequestHandler(id);
      // create blob and trigger download
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      setError('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="p-8">Loading trip...</div>;
  if (error) return (
    <div className="p-8">Error: {error} <button onClick={() => navigate('/trips')}>Back</button></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-blue-600">&larr; Back</button>
        <TripDetail trip={trip} onDownload={handleDownload} downloading={downloading} />
      </div>
    </div>
  );
}

export default TripDetailPage;
