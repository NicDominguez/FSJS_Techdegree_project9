const Sequelize = require('sequelize');

// Creates Book model with validation
module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    message: 'Please provide a first name'
                },
                notEmpty: {
                    message: 'Please provide a first name'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    message: 'Please provide a last name'
                },
                notEmpty: {
                    message: 'Please provide a last name'
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    message: 'Please provide an email address'
                },
                notEmpty: {
                    message: 'Please provide an email address'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    message: 'Please provide a password'
                },
                notEmpty: {
                    message: 'Please provide a password'
                }
            }
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course);
    }
    
    return User;
};
