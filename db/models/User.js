const Sequelize = require('sequelize');

// Creates Book model with validation
module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course);
    }

    return User;
};
