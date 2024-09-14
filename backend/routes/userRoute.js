const router = require("express").Router();

router.get("/get-all-user");

router.post("/create-user");

router.post("/edit-user/:userId");

router.delete("/delete-user/:userId");

module.exports = router;