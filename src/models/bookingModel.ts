import mongoose, {Document} from "mongoose";

import {IUser} from "./userModel";
import {IHotel} from "./hotelModel";

export interface IBooking extends Document {
  user: IUser;
  hotel: IHotel;
  paymentResult: {
    id: string;
    status: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };
  price: number;
  startDate: string;
  endDate: string;
  status: "pending" | "completed" | "cancelled";
}

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Hotel",
    },
    paymentResult: {
      id: {type: String},
      status: {type: String},
      razorpay_order_id: {type: String},
      razorpay_payment_id: {type: String},
      razorpay_signature: {type: String},
    },
    price: {type: Number, required: true},
    startDate: {type: String, required: true},
    endDate: {type: String, required: true},
    status: {type: String, default: "pending"},
  },
  {timestamps: true}
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
