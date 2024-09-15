const router = require("express").Router();

router.get("/get-all-course");

router.post("/create-course");

router.post("/edit-course/:courseId");

router.delete("/delete-course/:courseId");


module.exports = router;