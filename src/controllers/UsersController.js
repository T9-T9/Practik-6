const User = require('../models/User');

const UsersController = {
    // GET /users
    getAllUsers: async (req, res) => {
        console.log('Entering getAllUsers');
        try {
            console.log('Fetching users from DB...');
            const users = await User.find().sort({ createdAt: -1 });
            console.log(`Found ${users.length} users. Rendering view...`);
            res.render('index', { users });
        } catch (err) {
            console.error('ALL USERS ERROR:', err);
            res.status(500).send('Server Error: ' + err.message);
        }
    },

    // GET /users/create
    showCreateForm: (req, res) => {
        res.render('userForm', { user: null }); // null for create mode
    },

    // POST /users
    createUser: async (req, res) => {
        try {
            const { name, email, age, role } = req.body;
            // Использование паттерна Фабрика (Factory)
            const newUser = await require('../factories/UserFactory').createUser(name, email, age, role);

            // Использование паттерна Наблюдатель (Observer)
            require('../observers/ActivityLogger').notify({ event: 'USER_CREATED', user: newUser.email, timestamp: new Date() });

            res.redirect('/users');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating user');
        }
    },

    // GET /users/edit/:id
    showEditForm: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.render('userForm', { user });
        } catch (err) {
            console.error(err);
            res.status(404).send('User not found');
        }
    },

    // POST /users/update/:id
    updateUser: async (req, res) => {
        try {
            const { name, email, age, role } = req.body;
            await User.findByIdAndUpdate(req.params.id, { name, email, age, role });
            res.redirect('/users');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating user');
        }
    },

    // POST /users/delete/:id
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.redirect('/users');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting user');
        }
    }
};

module.exports = UsersController;
