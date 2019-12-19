const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");

const Room = db.define("room", {
  name: Sequelize.STRING
});

User.belongsTo(Room);
Room.hasMany(User);

module.exports = Room;
