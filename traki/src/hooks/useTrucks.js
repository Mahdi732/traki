import { useState, useEffect } from "react";
import { 
  getTrucksRequestHandler,
  createTruckRequestHandler, 
  getTruckByIdRequestHandler,
  updateTruckRequestHandler,
  deleteTruckRequestHandler
} from "../services/api/trucks.js";

// Hook to handle truck operations (list, create, update, delete)
// Returns: [trucks, loading, error, actions]
export function useTrucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all trucks on mount
  useEffect(() => {
    loadTrucks();
  }, []);

  // Fetch all trucks from API
  const loadTrucks = async () => {
    try {
      setLoading(true);
      const response = await getTrucksRequestHandler();
      setTrucks(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new truck
  const createTruck = async (truckData) => {
    try {
      setLoading(true);
      const response = await createTruckRequestHandler(truckData);
      setTrucks([...trucks, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing truck
  const updateTruck = async (id, updates) => {
    try {
      setLoading(true);
      const response = await updateTruckRequestHandler(id, updates);
      setTrucks(trucks.map(t => t._id === id ? response.data : t));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete truck
  const deleteTruck = async (id) => {
    try {
      setLoading(true);
      await deleteTruckRequestHandler(id);
      setTrucks(trucks.filter(t => t._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trucks,
    loading,
    error,
    loadTrucks,
    createTruck,
    updateTruck,
    deleteTruck,
  };
}
