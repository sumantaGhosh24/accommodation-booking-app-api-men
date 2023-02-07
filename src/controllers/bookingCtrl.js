import {Booking, User, Hotel} from "../models/index.js";

const bookingCtrl = {
  // get all bookings
  getBookings: async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel");
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // create booking
  createBooking: async (req, res) => {
    try {
      const {user, hotel, price, startDate, endDate, paymentResult} = req.body;
      const newBooking = new Booking({
        user,
        hotel,
        price,
        startDate,
        endDate,
        paymentResult,
      });
      await newBooking.save();
      return res.json({msg: "Booking confirmed."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // get single booking
  getBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel");
      if (!booking)
        return res.status(400).json({msg: "This booking does not exists."});
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // update booking
  updateBooking: async (req, res) => {
    try {
      const {status, isPaid} = req.body;
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        {status, isPaid},
        {new: true}
      );
      if (!booking)
        return res.status(400).json({msg: "Booking does not exists."});
      return res.status(400).json(booking);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // delete booking
  deleteBooking: async (req, res) => {
    try {
      await Booking.findByIdAndDelete(req.params.id);
      return res.json({msg: "Booking deleted."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // get booking by user
  getUserBooking: async (req, res) => {
    try {
      const booking = await Booking.find({user: req.user.id})
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel");
      if (!booking)
        return res.status(400).json({msg: "This booking does not exists."});
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // get all hotel booking
  getHotelBooking: async (req, res) => {
    try {
      const booking = await Booking.find({hotel: req.params.hotel})
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel");
      if (!booking)
        return res.status(400).json({msg: "This booking does not exists."});
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

export default bookingCtrl;
