const { Router } = require("express");
const Room = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleware");

function factory(stream) {
  const router = new Router();

  router.post("/gameroom", async (request, response, next) => {
    try {
      const room = await Room.create(request.body);
      const action = {
        type: "NEW_GAMEROOM",
        payload: room
      };
      const string = JSON.stringify(action);

      stream.send(string);
      response.send(room);
    } catch (error) {
      next(error);
    }
  });

  router.put("/join", auth, async (request, response, next) => {
    try {
      const user = await User.update(
        { roomId: request.body.roomId },
        { where: { id: request.user.id } }
      );

      const allRooms = await Room.findAll({ include: [User] });

      const action = {
        type: "ALL_ROOMS",
        payload: allRooms
      };

      const string = JSON.stringify(action);

      stream.send(string);
      response.send(user);
    } catch (error) {
      error(next);
    }
  });

  return router;
}

module.exports = factory;
