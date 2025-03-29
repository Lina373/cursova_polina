const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { PetProduct, PetProductInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class PetProductController {
    async create(req, res, next) {
        try {
            let { name, price, categoryId, typeId, info } = req.body;
            const { img } = req.files;

            if (!img) {
                return next(ApiError.badRequest('Не завантажено файл зображення'));
            }

            let fileName = uuid.v4() + ".jpg";

            await img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const petProduct = await PetProduct.create({
                name,
                price,
                categoryId,
                typeId,
                img: fileName
            });

            if (info) {
                info = JSON.parse(info);
                const infoPromises = info.map(i =>
                    PetProductInfo.create({
                        title: i.title,
                        description: i.description,
                        petProductId: petProduct.id
                    })
                );
                await Promise.all(infoPromises);
            }

            return res.json(petProduct);
        } catch (e) {
            console.error(e);

            if (fileName && fs.existsSync(path.resolve(__dirname, '..', 'static', fileName))) {
                fs.unlinkSync(path.resolve(__dirname, '..', 'static', fileName));
            }

            return next(ApiError.badRequest('Помилка при створенні продукту'));
        }
    }


    async getAll(req, res, next) {
        let { categoryId, typeId, limit, page, name } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 9;
        let offset = (page - 1) * limit;

        try {
            const filters = {};

            if (categoryId) filters.categoryId = categoryId;
            if (typeId) filters.typeId = typeId;

            if (name) {
                filters.name = { [Op.like]: `%${name}%` };
            }

            const petProducts = await PetProduct.findAndCountAll({
                where: filters,
                limit,
                offset
            });

            return res.json(petProducts);
        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest('Ошибка при отриман6і данних'));
        }
    }

    async getOne(req, res, next) {
        const { id } = req.params;
        try {
            const petProduct = await PetProduct.findOne({
                where: { id },
                include: [{ model: PetProductInfo, as: 'info' }]
            });

            if (!petProduct) {
                return next(ApiError.badRequest('Продукт не знайдено'));
            }

            return res.json(petProduct);
        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest('Помилка при отриманні продукту'));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        try {
            const petProduct = await PetProduct.findByPk(id);

            if (!petProduct) {
                return next(ApiError.badRequest('Продукт не знайдено'));
            }

            const filePath = path.resolve(__dirname, '..', 'static', petProduct.img);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            await petProduct.destroy();

            return res.json({ message: 'Продукт успішно видалено' });
        } catch (e) {
            console.error(e);
            return next(ApiError.badRequest('Помилка при видаленні продукту'));
        }
    }
}

module.exports = new PetProductController();