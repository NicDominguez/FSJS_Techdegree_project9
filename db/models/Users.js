const Sequelize = require('sequelize');

// Creates Book model with validation
module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            },
        lastNamee: {
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
