const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sse = require("json-sse");
const authRouter = require("./auth/router");
const userRouter = require("./user/router");
const roomFactory = require("./game-room/router");
const Room = require("./game-room/model");
const User = require("./user/model");

const port = process.env.PORT || 4000;
const app = express();

const corsMiddleware = cors();
const parserMiddleware = bodyParser.json();
const stream = new Sse();
const roomRouter = roomFactory(stream);

app.use(corsMiddleware);
app.use(parserMiddleware);

app.use(roomRouter);
app.use(authRouter);
app.use(userRouter);

app.get("/", (request, response) => {
  stream.send("test");
  response.send("hello");
});

app.get("/stream", async (request, response, next) => {
  try {
    const rooms = await Room.findAll({ include: [User] });

    const action = {
      type: "ALL_ROOMS",
      payload: rooms
    };

    const string = JSON.stringify(action);

    stream.updateInit(string);
    stream.init(request, response);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.log(`Hey, I'm on port ${port}!`));
