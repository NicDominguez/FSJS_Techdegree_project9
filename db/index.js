const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.json');

// Initializes Sequalize wehn requiring the book model
const sequelize = new Sequelize(config.development);

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

db.models.User = require('./models/User.js') (sequelize);
db.models.Course = require('./models/Course.js')(sequelize);

Object.keys(db.models).forEach(modelName => {
  if (db.models[modelName].associate) {
    db.models[modelName].associate(db.models);
  }
});

module.exports = db;

