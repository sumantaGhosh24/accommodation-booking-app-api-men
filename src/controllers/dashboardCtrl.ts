import {Request, Response} from "express";

import User, {IUser} from "../models/userModel";
import Hotel, {IHotel} from "../models/hotelModel";
import Booking, {IBooking} from "../models/bookingModel";
import Rating, {IRating} from "../models/ratingModel";
import Category, {ICategory} from "../models/categoryModel";
import {IReqAuth} from "../types";

const dashboardCtrl = {
  getAdminDashboard: async (req: Request, res: Response) => {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({status: "active"});
      const totalHotels = await Hotel.countDocuments();
      const totalBookings = await Booking.countDocuments();
      const totalRatings = await Rating.countDocuments();
      const totalCategories = await Category.countDocuments();

      const recentUsers: IUser[] = await User.find()
        .sort({createdAt: -1})
        .limit(5);
      const recentHotels: IHotel[] = await Hotel.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("owner")
        .populate("category");
      const recentBookings: IBooking[] = await Booking.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("user")
        .populate("hotel");
      const recentRatings: IRating[] = await Rating.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("user")
        .populate("hotel");
      const recentCategories: ICategory[] = await Category.find()
        .sort({createdAt: -1})
        .limit(5);

      const totalBookingPrice = await Booking.aggregate([
        {
          $group: {
            _id: null,
            total: {$sum: "$price"},
          },
        },
      ]);
      const totalRevenue = totalBookingPrice[0]?.total || 0;

      res.status(200).json({
        totalUsers,
        activeUsers,
        totalHotels,
        totalBookings,
        totalRatings,
        totalCategories,
        recentUsers,
        recentHotels,
        recentBookings,
        recentRatings,
        recentCategories,
        totalRevenue,
      });
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getDashboard: async (req: IReqAuth, res: Response) => {
    try {
      const userId = req.user?._id;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const userBookings: IBooking[] = await Booking.find({user: userId})
        .sort({createdAt: -1})
        .populate("hotel");
      const userRatings: IRating[] = await Rating.find({user: userId})
        .sort({createdAt: -1})
        .populate("hotel");

      const totalBookingsByUser = await Booking.aggregate([
        {$match: {user: userId}},
        {$group: {_id: null, total: {$sum: 1}}},
      ]);

      const totalBookingPriceByUser = await Booking.aggregate([
        {$match: {user: userId}},
        {$group: {_id: null, total: {$sum: "$price"}}},
      ]);

      res.status(200).json({
        user,
        userBookings,
        userRatings,
        totalBookings: totalBookingsByUser[0]?.total || 0,
        totalBookingPrice: totalBookingPriceByUser[0]?.total || 0,
      });
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default dashboardCtrl;
