import express from "express";

import {userCtrl} from "../controllers/index.js";
import {auth, authAdmin} from "../middleware/index.js";

const router = express.Router();

// register user
router.post("/register", userCtrl.register);

// register verify user
router.get("/register-verify", userCtrl.registerVerify);

// get refresh token
router.get("/refresh_token", userCtrl.refresh_token);

// add user data
router.put("/user-data", auth, userCtrl.userData);

// add user address
router.put("/user-address", auth, userCtrl.userAddress);

// login user
router.post("/login", userCtrl.login);

// login verify user
router.post("/login-verify", userCtrl.loginVerify);

// logout user
router.get("/logout", userCtrl.logout);

// update user data
router.put("/update-user-data/:id", auth, userCtrl.userDataUpdate);

// update user address
router.put("/update-user-address/:id", auth, userCtrl.userAddressUpdate);

// delete user
router.delete("/user/:id", auth, authAdmin, userCtrl.deleteUser);

// reset password
router.post("/reset-password", auth, userCtrl.resetPassword);

// forgot password
router.post("/forgot-password", userCtrl.forgotPassword);

// validate confirm forgot password
router.get(
  "/validate-confirm-forgot-password",
  userCtrl.validateConfirmForgotPassword
);

// confirm forgot password
router.post("/confirm-forgot-password", userCtrl.confirmForgotPassword);

// get all users
router.get("/users", auth, authAdmin, userCtrl.getUsers);

// get single user
router.get("/user/:id", auth, userCtrl.getUser);

export default router;
