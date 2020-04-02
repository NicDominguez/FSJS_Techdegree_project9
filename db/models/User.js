const Sequelize = require('sequelize');

// Creates Book model with validation
module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    message: 'Please provide a first name'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    message: 'Please provide a last name'
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    message: 'Please provide an email address'
                },
                isEmail: true,
            },                
            unique: {
                args: true,
                message: "This email has already been registered"
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    message: 'Please provide a password'
                }
            }
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
                foreignKey: {
                    fieldName: 'userId',
                    allowNull: false,
                },
            });
    }
    
    return User;
};
