const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./auth/router");
const userRouter = require("./user/router");

const port = process.env.PORT || 4000;
const app = express();

const corsMiddleware = cors();
const parserMiddleware = bodyParser.json();

app.use(corsMiddleware);
app.use(parserMiddleware);

app.use(authRouter);
app.use(userRouter);

app.listen(port, () => console.log(`Hey, I'm on port ${port}!`));
