const { userSignup, userLogin } = require("../controller/user/userContoller");

const router = require("express").Router();

router.get("/get-all-user");

router.post("/create-user", userSignup);

router.post("/user-login", userLogin)

router.post("/edit-user/:userId");

router.delete("/delete-user/:userId");

module.exports = router;