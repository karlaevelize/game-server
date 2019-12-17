const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sse = require("json-sse");
const authRouter = require("./auth/router");
const userRouter = require("./user/router");
const roomFactory = require("./game-room/router");

const port = process.env.PORT || 4000;
const app = express();

const corsMiddleware = cors();
const parserMiddleware = bodyParser.json();
const stream = new Sse();
const roomRouter = roomFactory(stream);

app.use(corsMiddleware);
app.use(parserMiddleware);

app.use(roomRouter);

app.get("/", (request, response) => {
  stream.send("test");
  response.send("hello");
});

app.get("/stream", (request, response) => {
  stream.init(request, response);
});

app.use(authRouter);
app.use(userRouter);

app.listen(port, () => console.log(`Hey, I'm on port ${port}!`));
