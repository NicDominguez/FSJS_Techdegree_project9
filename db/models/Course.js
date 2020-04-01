const Sequelize = require('sequelize');

// Creates Book model with validation
module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    Course.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    message: 'Please provide a title'
                },
                notEmpty: {
                    message: 'Please provide a title'
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    message: 'Please provide a description'
                },
                notEmpty: {
                    message: 'Please provide a description'
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true,
        }
    }, { sequelize });
    
    Course.associate = (models) => {
        Course.belongsTo(models.User);
    }

    return Course;
};