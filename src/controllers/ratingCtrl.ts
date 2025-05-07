import {Request, Response} from "express";

import Rating from "../models/ratingModel";
import {APIFeatures} from "../lib";
import {IReqAuth} from "../types";

const ratingCtrl = {
  getRatings: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Rating.find()
          .populate("hotel", "_id title description images")
          .populate("user", "_id username email mobileNumber image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Rating.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const ratings = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({ratings, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getHotelRatings: async (req: Request, res: Response) => {
    try {
      const ratings = await Rating.findById(req.params.hotel)
        .populate("hotel", "_id title description images")
        .populate("user", "_id username email mobileNumber image");
      if (!ratings) {
        res.status(404).json({message: "Rating not found."});
        return;
      }

      res.status(200).json(ratings);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getUserRatings: async (req: Request, res: Response) => {
    try {
      const ratings = await Rating.find({user: req.params.user})
        .populate("hotel", "_id title description image")
        .populate("user", "_id username email mobileNumber image");
      if (!ratings) {
        res.status(404).json({message: "Rating not found."});
        return;
      }

      res.status(200).json(ratings);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  createRating: async (req: IReqAuth, res: Response) => {
    try {
      const {hotel, comment, rating} = req.body;

      if (!hotel || !comment || !rating) {
        res.status(400).json({message: "Please fill all fields."});
        return;
      }

      const newRating = new Rating({
        hotel,
        user: req.user?._id as any,
        comment,
        rating,
      });
      await newRating.save();

      res.json({message: "Rating Created successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default ratingCtrl;
