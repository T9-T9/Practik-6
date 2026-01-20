const Product = require('../models/Product');

const ProductsController = {
    getAllProducts: async (req, res) => {
        try {
            let products = await Product.find();

            // Использование паттерна Стратегия (Strategy)
            const { SortByPrice, SortByName, SortContext } = require('../strategies/SortStrategy');
            const sortType = req.query.sort;
            let strategy;

            if (sortType === 'price') {
                strategy = new SortByPrice();
            } else {
                strategy = new SortByName(); // По умолчанию
            }

            const context = new SortContext(strategy);
            products = context.executeStrategy(products);

            res.render('productList', { products });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },

    // POST /products/buy/:id
    buyProduct: async (req, res) => {
        try {
            const productId = req.params.id;
            // For demo purposes, pick the first user found or a specific mockup user
            const User = require('../models/User');
            const user = await User.findOne();

            if (!user) {
                return res.status(400).send('No users found in database. Create a user first.');
            }

            const ShopFacade = require('../facades/ShopFacade');
            const result = await ShopFacade.purchaseItem(productId, user._id);

            res.render('success', {
                message: `Вы успешно купили ${result.product}!`,
                details: {
                    'Товар': result.product,
                    'Цена': `$${result.price}`,
                    'Покупатель': user.name,
                    'Остаток на складе': result.stock
                }
            });
        } catch (err) {
            console.error('Purchase Error:', err);
            res.status(500).send('Purchase Failed: ' + err.message);
        }
    },

    // POST /cart/add/:id
    addToCart: async (req, res) => {
        try {
            const productId = req.params.id;
            const User = require('../models/User');
            // Assuming single user for demo
            const user = await User.findOne();

            if (!user) return res.status(400).send('No user found');

            const existingItem = user.cart.find(item => item.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                user.cart.push({ product: productId, quantity: 1 });
            }
            await user.save();
            res.redirect('/products');
        } catch (err) {
            console.error('Add to Cart Error:', err);
            res.status(500).send('Error adding to cart');
        }
    },

    // GET /cart
    showCart: async (req, res) => {
        try {
            const User = require('../models/User');
            const user = await User.findOne().populate('cart.product');
            res.render('cart', { cart: user ? user.cart : [] });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    },

    // POST /cart/checkout
    checkout: async (req, res) => {
        try {
            const User = require('../models/User');
            const user = await User.findOne();
            if (!user) return res.status(400).send('No user found');

            const ShopFacade = require('../facades/ShopFacade');
            const result = await ShopFacade.checkoutCart(user._id);

            res.render('success', {
                message: `Заказ успешно оформлен!`,
                details: {
                    'Покупатель': user.name,
                    'Товаров': result.items.length,
                    'Общая сумма': `$${result.totalPrice}`,
                    'Статус': 'Оплачено'
                }
            });
        } catch (err) {
            console.error('Checkout Error:', err);
            res.status(500).send('Checkout Failed: ' + err.message);
        }
    }
};

module.exports = ProductsController;
