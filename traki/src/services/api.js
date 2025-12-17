import axios from "axios";

// Option B: httpOnly cookies only
// Backend sends token as httpOnly cookie (secure, cannot be accessed by JS)
// Frontend MUST send credentials to include cookies in requests
export const api = axios.create({
    baseURL: 'http://localhost:9849/api',  // Backend runs on port 9849
    timeout: 5000,
    withCredentials: true,  // CRITICAL: Sends cookies with every request
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    responseType: 'json',
});

api.interceptors.response.use((response) => {
    console.log('_________');
    console.log(response);
    console.log('_________');
    console.log(response.data);
    console.log('_________');
    console.log(response.headers);
    return response;
}, (error) => {
    if (error.response) {
        if (Number(error.response.status) === 401) {
            console.log('user session exipred');
        } else if (Number(error.response.status) === 403) {
            console.log('user dont have access for this');
        } else if (Number(error.response.status) === 500) {
            console.log('something broke');
        } else if (Number(error.response.status) === 422) {
            console.log('validation error');
        } else if (Number(error.response.status) === 429) {
            console.log('to many request you reach limit');
        } else {
            console.log(error.response.status);
        }
    }

    return Promise.reject(error)
}) 