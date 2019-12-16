const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const User = require("../user/model");
const router = new Router();
const bcrypt = require("bcrypt");
const auth = require("./middleware");

router.post("/login", (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;

  if (!email || !password) {
    response.status(400).send({
      message: "Please supply a valid email and password"
    });
  } else {
    User.findOne({
      where: {
        email: request.body.email
      }
    })
      .then(entity => {
        if (!entity) {
          response.status(400).send({
            message: "User with that email does not exist"
          });
        } else if (bcrypt.compareSync(request.body.password, entity.password)) {
          response.send({
            jwt: toJWT({ userId: entity.id })
          });
        } else {
          response.status(400).send({
            message: "Password was incorrect"
          });
        }
      })
      .catch(err => {
        console.error(err);
        response.status(500).send({
          message: "Something went wrong"
        });
      });
  }
});

router.get("/secret-endpoint", auth, (request, response) => {
  response.send({
    message: `Thanks for visiting the secret endpoint ${request.user.email}.`
  });
});

module.exports = router;
