import express from "express";

import {auth} from "../middleware/index.js";
import {paymentCtrl} from "../controllers/index.js";

const router = express.Router();

router.get("/logo.svg", auth, paymentCtrl.logo);

router.post("/verification", auth, paymentCtrl.verification);

router.post("/razorpay", auth, paymentCtrl.razorpay);

export default router;
