const router = require("express").Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/authorization");
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/logout", auth, AuthController.logout);

router.get("/private", auth, permit("user"), (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

module.exports = router;
