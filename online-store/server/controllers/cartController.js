const { Cart, Product, User } = require('../../server/models/models.js');

class CartController {
    async addToCart(req, res) {
        try {
            const { userId, productId, quantity } = req.body;

            let cart;
            if (userId) {
                cart = await Cart.findOne({ where: { userId }, include: Product });
                if (!cart) {
                    cart = await Cart.create({ userId });
                }
            } else {
                cart = { products: [] };
            }
            const product = await Product.findOne({ where: { id: productId } });
            if (!product) {
                return res.status(404).json({ message: 'Продукт не знайдено' });
            }

            if (userId) {
                await cart.addProduct(product, { through: { quantity } });
            } else {
                cart.products.push({ product, quantity });
            }

            return res.json({ message: 'Продукт додано до кошика' });
        } catch (e) {
            return res.status(500).json({ message: 'Помилка при додаванні товару до кошика', error: e.message });
        }
    }

    async getCart(req, res) {
        try {
            const { userId } = req.query;

            let cart;
            if (userId) {
                cart = await Cart.findOne({ where: { userId }, include: Product });
            } else {
                return res.json({ message: 'Для неавторизованих користувачів кошик зберігається локально' });
            }

            if (!cart) {
                return res.status(404).json({ message: 'Кошик не знайдено' });
            }

            return res.json(cart);
        } catch (e) {
            return res.status(500).json({ message: 'Помилка при отриманні кошика', error: e.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { userId, productId } = req.params;

            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                return res.status(404).json({ message: 'Кошик не знайдено' });
            }

            const product = await Product.findOne({ where: { id: productId } });
            if (!product) {
                return res.status(404).json({ message: 'Продукт не знайдено' });
            }

            await cart.removeProduct(product);

            return res.json({ message: 'Продукт видалено з кошика' });
        } catch (e) {
            return res.status(500).json({ message: 'Помилка при видаленні товару з кошика', error: e.message });
        }
    }

}

module.exports = new CartController();