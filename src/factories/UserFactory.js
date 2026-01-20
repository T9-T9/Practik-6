const User = require('../models/User');

class UserFactory {
    static async createUser(name, email, age, role = 'user') {
        // Factory Logic: Standardize role assignment or validation
        const validRoles = ['user', 'admin', 'manager'];
        const userRole = validRoles.includes(role) ? role : 'user';

        // Additional factory logic could go here (e.g. setting default permissions)

        return await User.create({
            name,
            email,
            age,
            role: userRole
        });
    }
}

module.exports = UserFactory;
