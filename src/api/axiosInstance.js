import { baseURL } from "@/utils/constants";
import { store } from "@/utils/reduxstores/Store";
import { loginSuccess,logout } from "@/utils/reduxstores/Authslice";
import axios from "axios";


const AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});


// Request interceptor to add access token to every request

AxiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState(); // ✅ Redux state
        const accessToken = state.auth.accessToken; 
        console.log(accessToken)
    if (accessToken) { // if access token is present, add it to the bearer-token
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => { // Error-handling
        console.error("Request error ::", error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 and 403 response

AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 1. Check if the error is 401/403 AND we haven't retried this specific request yet
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refresh_token_url = `${baseURL}/token/refresh/`;
                
                // 2. IMPORTANT: Use standard 'axios', NOT 'AxiosInstance' here.
                // This prevents the interceptor from running on the refresh call itself.
                const response = await axios.post(
                    refresh_token_url,
                    {},
                    { withCredentials: true }
                );
                
                const newAccessToken = response.data.access;
                console.log("nenew",newAccessToken)
                // 3. Update Redux
                store.dispatch(loginSuccess({ accessToken: newAccessToken }));

                // 4. Update the header and retry
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                
                // Here you can use AxiosInstance because _retry is now true, 
                // so it won't enter this block again if it fails a second time.
                return AxiosInstance(originalRequest);

            } catch (refreshError) {
                // 5. If refresh fails, clear auth and send to login
                store.dispatch(logout());
                // Only redirect if we aren't already on the login page to avoid loops
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;