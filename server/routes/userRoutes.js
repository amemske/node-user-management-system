const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//get the route, add contoller and get it's methods e.g. view
router.get("/", userController.view);
router.post("/", userController.find);
router.get("/adduser", userController.form);
router.post("/adduser", userController.create);
router.get("/edituser/:id", userController.edit);
router.post("/edituser/:id", userController.update);
router.get("/:id", userController.delete);
router.get("/viewuser/:id", userController.viewUser);

//export
module.exports = router;
