const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Не авторизований' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        return res.status(401).json({ message: 'Токен недійсний або прострочений' });
    }

};
