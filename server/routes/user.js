const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//get the route, add contoller and get it's methods e.g. view
router.get("/", userController.view);
router.post("/", userController.find);
router.get("/adduser", userController.form);
router.post("/adduser", userController.create);

//export
module.exports = router;
