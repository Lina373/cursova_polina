import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";
import { setTokenInCookie, getTokenFromCookie } from "./cookieUtils";
export const registration = async (email, password, firstName, secondName, lastName, phone) => {
    try {
        const { data } = await $host.post('api/user/registration', {
            email,
            password,
            firstName,
            secondName,
            lastName,
            phone,
            role: 'USER'
        });

        console.log("Полученный токен перед сохранением:", data.token);

        if (typeof data.token === 'string' && data.token.trim() !== '') {
            setTokenInCookie(data.token);
            console.log('Токен сохранён в cookie:', data.token);
        } else {
            console.error('Получен некорректный токен:', data.token);
        }

        return jwt_decode(data.token);
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password });

    console.log('Полученный токен:', data.token);

    if (data.token) {
        setTokenInCookie(data.token);
        console.log('Токен сохранён в cookie:', data.token);
    } else {
        console.error('Получен пустой или некорректный токен');
    }

    return jwt_decode(data.token);
};

export const check = async () => {
    try {
        const token = getTokenFromCookie();
        console.log('Токен из куки при загрузке:', token);
        if (token) {
            const { data } = await $authHost.get('api/user/auth', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (data.token) {
                setTokenInCookie(data.token);
            }
            return jwt_decode(data.token);
        } else {
            throw new Error('Token not found');
        }
    } catch (error) {
        console.error('Authorization failed:', error.response?.data?.message || error.message);
        return { error: 'Authorization failed. Please login again.' };
    }
};


