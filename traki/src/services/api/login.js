import {api} from "../api.js";

export const loginRequestHandler = async (email, password) => {
    return await api.post('/auth/login', {
        email: email,
        password: password,
    });
}