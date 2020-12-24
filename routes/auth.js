const router = require("express").Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/authorization");
const AuthController = require("../controller/AuthController");

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get("/private", auth, permit("cooker"), (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

module.exports = router;
