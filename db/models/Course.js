const Sequelize = require('sequelize');

// Creates Book model with validation
module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    Course.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
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
