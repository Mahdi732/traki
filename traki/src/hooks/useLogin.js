import { useState } from "react";
import { loginRequestHandler } from "../services/api/login.js";

export function useLogin () {
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);

    async function login ({email, password}) {
        console.log('this is the deta to send from login in use login ' + email + " and password " + password)
        try {
            setLoading(true);
            const response = await loginRequestHandler(email, password);
            setError(null)
            return response;
        } catch (error) {
            setError(error.message)
        }finally {
            setLoading(false)
        }
    }

    return [error, isLoading, login];
}