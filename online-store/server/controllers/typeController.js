const { Type, PetProduct } = require('../models/models');

const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res) {
        const { name } = req.body;

        const existingType = await Type.findOne({ where: { name } });
        if (existingType) {
            return res.status(400).json({ message: "Така категорія вже існує" });
        }

        const type = await Type.create({ name });
        return res.json(type);
    }

    async getAll(req, res) {
        const types = await Type.findAll();
        return res.json(types);
    }

    async delete(req, res, next) {
        const { id } = req.params;

        const petProductCount = await PetProduct.count({ where: { typeId: id } });

        if (petProductCount > 0) {
            return next(ApiError.badRequest('Тип не можливо видалити'));
        }

        const type = await Type.findOne({ where: { id } });

        if (!type) {
            return next(ApiError.notFound('Тип не знайдено'));
        }

        await type.destroy();
        return res.json({ message: 'Тип успішно видалений' });
    }

}

module.exports = new TypeController();
