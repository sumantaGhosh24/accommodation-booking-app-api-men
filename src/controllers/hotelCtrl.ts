import {Request, Response} from "express";

import {APIFeatures} from "../lib";
import Hotel from "../models/hotelModel";
import Rating from "../models/ratingModel";
import {IReqAuth} from "../types";

const hotelCtrl = {
  getHotels: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Hotel.find().populate("owner", "_id username email mobileNumber image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Hotel.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const hotels = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.status(200).json({hotels, count});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  createHotel: async (req: IReqAuth, res: Response) => {
    try {
      const {
        title,
        description,
        content,
        images,
        category,
        price,
        country,
        city,
        zip,
        address,
        latitude,
        longitude,
      } = req.body;
      const owner = req.user?._id;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        res.status(400).json({message: errors});
        return;
      }

      const newHotel = new Hotel({
        owner: owner,
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        content: content.toLowerCase(),
        images,
        category,
        price,
        country,
        city,
        zip,
        address,
        latitude,
        longitude,
      });
      await newHotel.save();

      res.json({message: "Hotel Created successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getHotel: async (req: Request, res: Response) => {
    try {
      const hotel = await Hotel.findById(req.params.id).populate(
        "owner",
        "_id username email mobileNumber image"
      );
      if (!hotel) {
        res.status(400).json({message: "This hotel does not exists."});
        return;
      }

      const ratings = await Rating.find({hotel: req.params.id});

      res.status(200).json({hotel, ratings});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  updateHotel: async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        content,
        images,
        category,
        price,
        country,
        city,
        zip,
        address,
        latitude,
        longitude,
      } = req.body;

      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) {
        res.status(400).json({message: "This hotel does not exists."});
        return;
      }

      if (title) hotel.title = title.toLowerCase();
      if (description) hotel.description = description.toLowerCase();
      if (content) hotel.content = content.toLowerCase();
      if (images) hotel.images = images;
      if (category) hotel.category = category;
      if (price) hotel.price = price;
      if (country) hotel.country = country;
      if (city) hotel.city = city;
      if (zip) hotel.zip = zip;
      if (address) hotel.address = address;
      if (latitude) hotel.latitude = latitude;
      if (longitude) hotel.longitude = longitude;
      await hotel.save();

      res.json({message: "Hotel updated successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  deleteHotel: async (req: Request, res: Response) => {
    try {
      const hotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!hotel) {
        res.status(400).json({message: "this hotel does not exists."});
        return;
      }

      res.status(200).json({message: "Hotel deleted successful."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default hotelCtrl;
