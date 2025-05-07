import mongoose, {Document} from "mongoose";

import {ICategory} from "./categoryModel";
import {IUser} from "./userModel";

export interface IHotel extends Document {
  owner: IUser;
  title: string;
  description: string;
  content: string;
  images: {
    url: string;
    public_id: string;
  }[];
  category: ICategory;
  price: number;
  booked: boolean;
  country: string;
  city: string;
  zip: string;
  address: string;
  latitude: string;
  longitude: string;
  verified: boolean;
}

const hotelSchema = new mongoose.Schema(
  {
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    title: {type: String, trim: true, required: true},
    description: {type: String, trim: true, required: true},
    content: {type: String, trim: true, required: true},
    images: [{url: String, public_id: String}],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    price: {type: Number, required: true},
    booked: {type: Boolean, default: false},
    country: {type: String, required: true},
    city: {type: String, required: true},
    zip: {type: String, required: true},
    address: {type: String, required: true},
    latitude: {type: String, required: true},
    longitude: {type: String, required: true},
    verified: {type: Boolean, default: false},
  },
  {timestamps: true}
);

const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);

export default Hotel;
