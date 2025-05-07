import {Request, Response} from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

import {IReqAuth} from "../types";
import {APIFeatures} from "../lib";
import Booking from "../models/bookingModel";

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const bookingCtrl = {
  getRazorpay: async (req: Request, res: Response) => {
    try {
      const {amount} = req.body;
      const options = {
        amount: Number(amount * 100),
        currency: "INR",
      };

      const order = await instance.orders.create(options);
      if (!order) {
        res.status(500).json({message: "server error"});
        return;
      }

      res.json(order);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  verification: async (req: IReqAuth, res: Response) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        amount,
        hotel,
        startDate,
        endDate,
      } = req.body;
      const user = req?.user?._id;

      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      );
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");
      if (digest !== razorpaySignature) {
        res.status(400).json({message: "Transaction not legit!"});
        return;
      }

      const newBooking = new Booking({
        user: user,
        hotel,
        paymentResult: {
          id: orderCreationId,
          status: "success",
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        },
        price: amount,
        startDate,
        endDate,
        status: "pending",
      });
      await newBooking.save();

      res.json({
        message: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getBookings: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Booking.find()
          .populate("user", "_id username email mobileNumber image")
          .populate("hotel"),
        req.query
      );
      const features2 = new APIFeatures(Booking.find(), req.query);

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const bookings = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({bookings, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getBooking: async (req: Request, res: Response) => {
    try {
      const booking = await Booking.findById(req.params.id)
        .populate("user", "_id username email mobileNumber image")
        .populate("hotel");
      if (!booking) {
        res.status(400).json({message: "This booking does not exists."});
        return;
      }
      res.json(booking);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  updateBooking: async (req: Request, res: Response) => {
    try {
      const {status} = req.body;
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        {status},
        {new: true}
      );
      if (!booking) {
        res.status(400).json({message: "Booking does not exists."});
        return;
      }
      res.json({message: "Booking updated successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getUserBookings: async (req: IReqAuth, res: Response) => {
    try {
      const features = new APIFeatures(
        Booking.find({user: req.user?._id})
          .populate("user", "_id username email mobileNumber image")
          .populate("hotel"),
        req.query
      );
      const features2 = new APIFeatures(
        Booking.find({user: req.user?._id}),
        req.query
      );

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const bookings = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({bookings, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getHotelBookings: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Booking.find({hotel: req.params.hotel})
          .populate("user", "_id username email mobileNumber image")
          .populate("hotel"),
        req.query
      );
      const features2 = new APIFeatures(
        Booking.find({hotel: req.params.hotel}),
        req.query
      );

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const bookings = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({bookings, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default bookingCtrl;
