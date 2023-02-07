import {APIFeatures} from "../lib/index.js";
import {Hotel, Rating} from "../models/index.js";

const hotelCtrl = {
  // get all hotels
  getHotels: async (req, res) => {
    try {
      const features = new APIFeatures(
        Hotel.find().populate("owner", "_id username email mobileNumber image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const result = await Promise.allSettled([
        features.query,
        Hotel.countDocuments(),
      ]);
      const hotels = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : 0;
      return res.status(200).json({hotels, count});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // create hotel
  createHotel: async (req, res) => {
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
      const owner = req.user.id;
      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({msg: errors});
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
      return res.status(200).json(newHotel);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // get single hotel
  getHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id).populate(
        "owner",
        "_id username email mobileNumber image"
      );
      if (!hotel)
        return res.status(400).json({msg: "This hotel does not exists."});
      const rating = await Rating.find({hotel: req.params.id});
      return res.status(200).json({hotel, rating});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // update hotel
  updateHotel: async (req, res) => {
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
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        {
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
        },
        {new: true}
      );
      if (!hotel)
        return res.status(400).json({msg: "This hotel does not exists."});
      return res.status(200).json(hotel);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  // delete hotel
  deleteHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndDelete(req.params.id);
      if (!hotel)
        return res.status(400).json({msg: "this hotel does not exists."});
      return res.status(200).json({msg: "Hotel deleted successful."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

export default hotelCtrl;
