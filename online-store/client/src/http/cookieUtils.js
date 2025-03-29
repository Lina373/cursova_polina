export function setTokenInCookie(token) {
    console.log("Токен перед проверкой setTokenInCookie:", token);  // Для отладки
    if (!token || typeof token !== 'string' || token.trim() === '') {
        console.error('Некорректный токен:', token);
        return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + (60 * 60 * 1000)); // Токен будет действителен 1 час

    try {
        // Устанавливаем cookie с токеном
        document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

        // Подтверждаем, что токен сохранен
        console.log('Токен успешно сохранен в cookie:', token);
    } catch (error) {
        console.error('Ошибка при сохранении токена в cookie:', error);
    }
}



export function getTokenFromCookie() {
    try {
        const match = document.cookie.match(/(^| )token=([^;]+)/);

        return match ? match[2] : null;
    } catch (error) {
        console.error('Ошибка при получении токена из cookie:', error);
        return null;
    }
}


export function removeTokenFromCookie() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
}

