const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const UsersController = require('./src/controllers/UsersController');
const ProductsController = require('./src/controllers/ProductsController');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // if we had static assets

// View Engine Setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'src/views'));

// Подключение к базе данных (Паттерн Singleton)
require('./src/utils/Database');

// Маршруты

// Главная страница -> Список пользователей
app.get('/', UsersController.getAllUsers);

// Маршруты пользователей
app.get('/users', UsersController.getAllUsers);
app.get('/users/create', UsersController.showCreateForm);
app.post('/users', UsersController.createUser);
app.get('/users/edit/:id', UsersController.showEditForm);
app.post('/users/update/:id', UsersController.updateUser);
app.post('/users/delete/:id', UsersController.deleteUser);

// Product Routes (Basic)
app.get('/products', ProductsController.getAllProducts);
app.post('/products/buy/:id', ProductsController.buyProduct); // Legacy single buy
app.get('/cart', ProductsController.showCart);
app.post('/cart/add/:id', ProductsController.addToCart);
app.post('/cart/checkout', ProductsController.checkout);

// Параллельный паттерн: Производитель-Потребитель (Worker Threads)
app.get('/admin/report', (req, res) => {
    // If query param ?generate=true is present, run the worker
    if (req.query.generate === 'true') {
        const { Worker } = require('worker_threads');
        const path = require('path');

        console.log('[Producer] Main thread dispatching report task...');

        const worker = new Worker(path.join(__dirname, 'src/workers/ReportWorker.js'), {
            workerData: { reportId: 'REP-' + Date.now() }
        });

        worker.on('message', (report) => {
            console.log('[Producer] Main thread received report:', report);
            // Render the report view with data
            res.render('report', { report });
        });

        worker.on('error', (err) => {
            console.error(err);
            res.status(500).send('Worker Error');
        });
    } else {
        // Just show the report page without data
        res.render('report', { report: null });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
