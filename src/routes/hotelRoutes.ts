import express from "express";

import hotelCtrl from "../controllers/hotelCtrl";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.get("/hotels", hotelCtrl.getHotels);

router.post("/hotel", authAdmin, hotelCtrl.createHotel);

router
  .route("/hotel/:id")
  .get(hotelCtrl.getHotel)
  .put(authAdmin, hotelCtrl.updateHotel)
  .delete(authAdmin, hotelCtrl.deleteHotel);

export default router;
