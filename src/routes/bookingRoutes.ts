import express from "express";

import bookingCtrl from "../controllers/bookingCtrl";
import auth from "../middleware/auth";
import authAdmin from "../middleware/authAdmin";

const router = express.Router();

router.post("/razorpay", auth, bookingCtrl.getRazorpay);

router.post("/verification", auth, bookingCtrl.verification);

router.get("/bookings", authAdmin, bookingCtrl.getBookings);

router.get("/booking/:id", auth, bookingCtrl.getBooking);

router.put("/booking/:id", auth, bookingCtrl.updateBooking);

router.get("/user-bookings", auth, bookingCtrl.getUserBookings);

router.get("/hotel-bookings/:hotel", authAdmin, bookingCtrl.getHotelBookings);

export default router;
