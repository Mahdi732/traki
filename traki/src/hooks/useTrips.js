import { useState, useEffect } from "react";
import { 
  getTripsRequestHandler,
  getMyTripsRequestHandler,
  createTripRequestHandler,
  getTripByIdRequestHandler,
  updateTripRequestHandler,
  deleteTripRequestHandler
} from "../services/api/trips.js";

// Hook to handle trip operations (list, create, update, delete)
// Takes userRole to filter data based on access level
// Returns: [trips, loading, error, actions]
export function useTrips(userRole) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load trips on mount based on user role
  useEffect(() => {
    loadTrips();
  }, [userRole]);

  // Fetch trips from API based on user role
  const loadTrips = async () => {
    try {
      setLoading(true);
      let response;
      
      // Admin sees all trips, Driver sees only their trips
      if (userRole === 'ADMIN') {
        response = await getTripsRequestHandler();
      } else {
        response = await getMyTripsRequestHandler();
      }
      
      setTrips(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new trip (admin only)
  const createTrip = async (tripData) => {
    try {
      setLoading(true);
      const response = await createTripRequestHandler(tripData);
      setTrips([...trips, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing trip
  const updateTrip = async (id, updates) => {
    try {
      setLoading(true);
      const response = await updateTripRequestHandler(id, updates);
      setTrips(trips.map(t => t._id === id ? response.data : t));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete trip
  const deleteTrip = async (id) => {
    try {
      setLoading(true);
      await deleteTripRequestHandler(id);
      setTrips(trips.filter(t => t._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const download = async (id) => {
    try {
      setLoading(true);
      await downloadTripRequestHandler(id);
      setTrips(trips.filter(t => t._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    loading,
    error,
    loadTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
}
