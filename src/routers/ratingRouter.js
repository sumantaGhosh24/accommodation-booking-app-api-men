import express from "express";

import {ratingCtrl} from "../controllers/index.js";
import {auth} from "../middleware/index.js";

const router = express.Router();

// get rating by hotel
router.get("/rating/:hotel", ratingCtrl.getRatings);

// get rating by user
router.get("/ratings/:user", auth, ratingCtrl.getUserRatings);

// create rating
router.post("/rating/:hotel", auth, ratingCtrl.createRating);

export default router;
