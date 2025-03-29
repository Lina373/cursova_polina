import axios from "axios";
import Cookies from 'js-cookie';

const getTokenFromCookie = (cookieName) => {
    return Cookies.get(cookieName);
};

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = (config) => {
    const token = getTokenFromCookie('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
};

$authHost.interceptors.request.use(authInterceptor, error => Promise.reject(error));

export { $host, $authHost };
