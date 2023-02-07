import express from "express";

import {hotelCtrl} from "../controllers/index.js";
import {auth, authAdmin} from "../middleware/index.js";

const router = express.Router();

// get all hotels
router.get("/hotels", hotelCtrl.getHotels);

// create hotel
router.post("/hotel", auth, authAdmin, hotelCtrl.createHotel);

// get single hotel and update hotel and delete hotel
router
  .route("/hotel/:id")
  .get(hotelCtrl.getHotel)
  .put(auth, authAdmin, hotelCtrl.updateHotel)
  .delete(auth, authAdmin, hotelCtrl.deleteHotel);

export default router;
