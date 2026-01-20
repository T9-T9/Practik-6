const Product = require('../models/Product');
const User = require('../models/User'); // In real app, might use User Service
const PaymentAdapter = require('../services/PaymentAdapter');

class ShopFacade {
    constructor() {
        this.paymentProcessor = new PaymentAdapter();
    }

    async purchaseItem(productId, userId) {
        console.log(`[Facade] Начат процесс покупки для товара: ${productId}, Пользователь: ${userId}`);

        // 1. Проверка доступности товара
        const product = await Product.findById(productId);
        if (!product || product.stock <= 0) {
            throw new Error("Товар закончился или не найден");
        }

        // 2. Проверка валидности пользователя (упрощенно)
        const user = await User.findById(userId);
        if (!user) throw new Error("Пользователь не найден");

        // 3. Обработка платежа
        // В реальности цена берется из товара
        const paymentResult = this.paymentProcessor.processPayment(product.price);

        if (paymentResult) {
            // 4. Списание со склада
            product.stock -= 1;
            await product.save();
            console.log(`[Facade] Покупка успешна. Склад обновлен.`);
            return { status: 'success', product: product.name, price: product.price, stock: product.stock };
        } else {
            throw new Error("Оплата не прошла");
        }
    }
    async checkoutCart(userId) {
        console.log(`[Facade] Оформление заказа корзины для пользователя: ${userId}`);

        const user = await User.findById(userId).populate('cart.product');
        if (!user || user.cart.length === 0) {
            throw new Error("Корзина пуста");
        }

        let totalAmount = 0;
        const purchasedItems = [];

        // 1. Проверка стока и расчет суммы
        for (const item of user.cart) {
            const product = item.product;
            if (!product) continue;

            if (product.stock < item.quantity) {
                throw new Error(`Недостаточно товара: ${product.name}`);
            }
            totalAmount += product.price * item.quantity;
        }

        // 2. Оплата
        const paymentResult = this.paymentProcessor.processPayment(totalAmount);

        if (paymentResult) {
            // 3. Списание со склада
            for (const item of user.cart) {
                const product = await Product.findById(item.product._id);
                product.stock -= item.quantity;
                await product.save();
                purchasedItems.push({
                    name: product.name,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            // 4. Очистка корзины
            user.cart = [];
            await user.save();

            return {
                status: 'success',
                totalPrice: totalAmount,
                items: purchasedItems
            };
        } else {
            throw new Error("Оплата не прошла");
        }
    }
}

module.exports = new ShopFacade();
