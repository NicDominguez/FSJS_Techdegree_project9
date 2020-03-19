const Sequelize = require('sequelize');

// Initializes Sequalize wehn requiring the book model
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'fsjstd-restapi.db'
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database successful!");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
})();


const db = {
    sequelize,
    Sequelize,
    models: {},
};

db.models.users = require('./models/users.js') (sequelize);
db.models.courses = require("./models/courses.js")(sequelize);

module.exports = db;

