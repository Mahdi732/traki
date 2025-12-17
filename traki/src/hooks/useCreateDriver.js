import { useState } from "react";
import { createDriverRequestHandler } from "../services/api/drivers.js";

// Hook to handle driver creation
// Returns: [error, isLoading, createDriver function]
export function useCreateDriver() {
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);

    async function createDriver({ name, email, password }) {
        try {
            setLoading(true);
            const response = await createDriverRequestHandler(name, email, password);
            setError(null);
            return response;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return [error, isLoading, createDriver];
}
