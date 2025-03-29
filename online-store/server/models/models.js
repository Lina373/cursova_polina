const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const argon2 = require('argon2');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(150), unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(150), allowNull: false },
    firstName: { type: DataTypes.STRING(150), allowNull: false },
    secondName: { type: DataTypes.STRING(150), allowNull: false },
    lastName: { type: DataTypes.STRING(150), allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

const Basket = sequelize.define('basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketPetProduct = sequelize.define('basket_pet_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const PetProduct = sequelize.define('pet_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
});

const Type = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), unique: true, allowNull: false },
});

const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), unique: true, allowNull: false },
});


const PetProductInfo = sequelize.define('pet_product_info', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
});

const TypeCategory = sequelize.define('type_category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Order = sequelize.define('orders', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: DataTypes.STRING, defaultValue: 'в обробці' },
    email: { type: DataTypes.STRING(150), allowNull: false },
    phone: { type: DataTypes.STRING(150), allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    cart: { type: DataTypes.TEXT, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketPetProduct);
BasketPetProduct.belongsTo(Basket);

Type.hasMany(PetProduct);
PetProduct.belongsTo(Type);

Category.hasMany(PetProduct);
PetProduct.belongsTo(Category);

PetProduct.hasMany(BasketPetProduct);
BasketPetProduct.belongsTo(PetProduct);

PetProduct.hasMany(PetProductInfo, { as: 'info' });
PetProductInfo.belongsTo(PetProduct);

Type.belongsToMany(Category, { through: TypeCategory });
Category.belongsToMany(Type, { through: TypeCategory });

User.hasMany(Order);
Order.belongsTo(User);

const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ where: { role: 'ADMIN' } });

        if (!adminExists) {
            const hashedPassword = await argon2.hash('admin');

            await User.create({
                email: 'admin',
                password: hashedPassword,
                phone: '00-00',
                firstName: 'admin',
                secondName: 'admin',
                lastName: 'admin',
                role: 'ADMIN',
            });

            console.log('Администратор успешно добавлен!');
        } else {
            console.log('Администратор уже существует!');
        }
    } catch (error) {
        console.error('Ошибка при создании администратора:', error);
    }
};
createAdminUser();

module.exports = {
    User,
    Basket,
    BasketPetProduct,
    PetProduct,
    Type,
    Category,
    TypeCategory,
    PetProductInfo,
    Order,
};
