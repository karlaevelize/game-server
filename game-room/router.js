const { Router } = require("express");
const Room = require("./model");
const User = require("../user/model");

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

  router.put("/join", async (request, response, next) => {
    try {
      const user = await User.update(
        { roomId: request.body.roomId },
        { where: { id: request.body.userId } }
      );

      response.send(user);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = factory;
