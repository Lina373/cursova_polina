const { Order } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    async create(req, res, next) {
        const { cart, email, phone, userId } = req.body;

        if (!cart || !email || !phone) {
            return next(ApiError.badRequest('Недостатньо даних для створення замовлення'));
        }

        try {
            const newOrder = await Order.create({
                cart: JSON.stringify(cart),
                email,
                phone,
                userId: userId || null,
                status: 'Оброблено',
            });

            return res.status(201).json({ message: 'Замовлення успішно створено', order: newOrder });
        } catch (error) {
            console.error('Помилка при створенні замовлення:', error);
            return next(ApiError.internal('Помилка при створенні замовлення', error.message));
        }
    }


    async getAll(req, res, next) {
        try {
            const orders = await Order.findAll();
            return res.json(orders);
        } catch (error) {
            console.error('Помилка при отриманні замовлень:', error);
            return next(ApiError.internal('Помилка при отриманні замовлень', error.message));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;

        try {
            const order = await Order.findOne({ where: { id } });

            if (!order) {
                return next(ApiError.notFound('Замовлення не знайдено'));
            }

            await order.destroy();

            return res.status(200).json({ message: 'Замовлення успішно видалено' });
        } catch (error) {
            console.error('Помилка при видаленні замовлення:', error);
            return next(ApiError.internal('Помилка при видаленні замовлення', error.message));
        }
    }
}

module.exports = new OrderController();