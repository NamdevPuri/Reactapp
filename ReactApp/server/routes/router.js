const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.js");
const userConroller = require("../controller/controller.js");

// router.get("/",(req,res)=>{
//     console.log("connect");
// });

// register user
router.post("/register", userConroller.register);

router.post("/login", userConroller.login);

router.get("/getUser", userConroller.userData);

router.get("/getUser/:id", userConroller.getUserById);

router.patch("/updateUser/:id",auth, userConroller.updateUser);

router.delete("/deleteuser/:id", userConroller.deleteUser);

module.exports = router;
