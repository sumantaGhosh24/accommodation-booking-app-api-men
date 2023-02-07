import {Rating, Hotel} from "../models/index.js";

const ratingCtrl = {
  // get rating by hotel
  getRatings: async (req, res) => {
    try {
      const ratings = await Rating.find({hotel: req.params.hotel}).populate(
        "user",
        "username email image"
      );
      if (!ratings) return res.status(400).json({msg: "No review exists."});
      return res.status(200).json(ratings);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // get rating by user
  getUserRatings: async (req, res) => {
    try {
      const ratings = await Rating.find({user: req.params.user}).populate(
        "hotel"
      );
      if (!ratings) return res.status(400).json({msg: "No review exists."});
      return res.status(200).json(ratings);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // create hotel
  createRating: async (req, res) => {
    try {
      const {comment, rating} = req.body;
      const hotel = req.params.hotel;
      const user = req.user.id;
      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) return res.status(400).json({msg: errors});
      const newRating = new Rating({
        hotel,
        user,
        comment: comment.toLowerCase(),
        rating: Number(rating),
      });
      await newRating.save();
      return res.status(200).json(newRating);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

export default ratingCtrl;
