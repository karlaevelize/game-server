const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");

const Room = db.define("room", {
  name: Sequelize.STRING,
  players: {
    type: Sequelize.INTEGER,
    validate: {
      min: 2,
      max: 2
    }
  }
});

User.belongsTo(Room);
Room.hasMany(User);

module.exports = Room;
