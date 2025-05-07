import express from "express";

import ratingCtrl from "../controllers/ratingCtrl";
import auth from "../middleware/auth";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.get("/ratings", authAdmin, ratingCtrl.getRatings);

router.get("/rating/:hotel", ratingCtrl.getHotelRatings);

router.get("/rating/user/:user", ratingCtrl.getUserRatings);

router.post("/rating/:hotel", auth, ratingCtrl.createRating);

export default router;
