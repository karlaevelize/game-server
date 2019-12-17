const { Router } = require("express");
const User = require("./model");
const router = new Router();
const bcrypt = require("bcrypt");

router.post("/user", (request, response, next) => {
  const user = {
    email: request.body.email,
    password: bcrypt.hashSync(request.body.password, 3)
  };
  User.create(user)
    .then(user => response.send(user))
    .catch(errors => next(errors));
});

router.get("/user", (request, response, next) => {
  const limit = request.query.limit || 100;
  const offset = request.query.offset || 0;

  User.findAndCountAll({ limit, offset })
    .then(result => response.send({ events: result.rows, total: result.count }))
    .catch(error => next(error));
});

module.exports = router;
