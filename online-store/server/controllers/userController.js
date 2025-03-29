const ApiError = require('../error/ApiError');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    async registration(req, res, next) {
        const { email, password, role, phone, firstName, secondName, lastName } = req.body;

        if (!email || !password || !phone || !firstName || !secondName || !lastName) {
            return next(ApiError.badRequest('Некоректні дані. Усі поля обов\'язкові для заповнення.'));
        }

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('Користувач з таким email вже існує'));
        }

        const hashPassword = await argon2.hash(password);

        const user = await User.create({
            email,
            role,
            password: hashPassword,
            phone,
            firstName,
            secondName,
            lastName
        });

        const basket = await Basket.create({ userId: user.id });

        const token = generateJwt(user.id, user.email, user.role);

        return res.json({ token });
    }

    async getUserData(req, res, next) {
        const { userId } = req.params;

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                return next(ApiError.notFound('Коритувача не знайдено'));
            }

            return res.json({
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
            });
        } catch (error) {
            console.error('Ошибка при отриман6і данних:', error);
            return next(ApiError.internal('Ошибка при отриман6і данних', error.message));
        }
    }
    async login(req, res, next) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.internal('Користувача не знайдено'));
        }

        const comparePassword = await argon2.verify(user.password, password);
        if (!comparePassword) {
            return next(ApiError.internal('Вказано невірний пароль'));
        }

        const token = generateJwt(user.id, user.email, user.role);

        return res.json({ token });
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token });
    }
}

module.exports = new UserController();