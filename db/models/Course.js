'use strict';

const Sequelize = require('sequelize');

// Creates Book model with validation
module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    message: 'Please provide a title'
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
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
        Course.belongsTo(models.User, {
                foreignKey: {
                    fieldName: 'userId',
                    allowNull: false,
                },
            });
    }

    return Course;
};