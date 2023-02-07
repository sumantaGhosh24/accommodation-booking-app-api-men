import express from "express";

import {bookingCtrl} from "../controllers/index.js";
import {auth, authAdmin} from "../middleware/index.js";

const router = express.Router();

// get all bookings
router.get("/bookings", auth, authAdmin, bookingCtrl.getBookings);

// create booking
router.post("/booking", auth, bookingCtrl.createBooking);

// get single booking and update booking and delete booking
router
  .route("/booking/:id")
  .get(auth, bookingCtrl.getBooking)
  .put(auth, authAdmin, bookingCtrl.updateBooking)
  .delete(auth, authAdmin, bookingCtrl.deleteBooking);

// get booking by user
router.get("/booking", auth, bookingCtrl.getUserBooking);

// get all hotel booking
router.get(
  "/hotel-booking/:hotel",
  auth,
  authAdmin,
  bookingCtrl.getHotelBooking
);

export default router;
