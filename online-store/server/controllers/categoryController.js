const {Category, PetProduct} = require('../models/models')
const ApiError = require('../error/ApiError');

class CategoryController {
    async create(req, res, next) {
        try {
            const { name } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ message: "Назва категорії не може бути порожньою" });
            }

            const existingType = await Category.findOne({ where: { name } });
            if (existingType) {
                return res.status(400).json({ message: "Така категорія вже існує" });
            }

            const category = await Category.create({ name });
            return res.json(category);
        } catch (error) {
            next(ApiError.internal("Не вдалося створити категорію"));
        }
    }

    async getAll(req, res, next) {
        try {
            const categores = await Category.findAll();
            return res.json(categores);
        } catch (error) {
            next(ApiError.internal("Не вдалося отримати список категорій"));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const petProductCount = await PetProduct.count({ where: { categoryId: id } });

            if (petProductCount > 0) {
                return next(ApiError.badRequest('Категорію не можливо видалити'));
            }

            const category = await Category.findOne({ where: { id } });

            if (!category) {
                return next(ApiError.notFound('Категорію не знайдено'));
            }

            await category.destroy();
            return res.json({ message: 'Категорія успішно видалена' });
        } catch (error) {
            next(ApiError.internal("Не вдалося видалити категорію"));
        }
    }
}

module.exports = new CategoryController();


module.exports = new CategoryController()
