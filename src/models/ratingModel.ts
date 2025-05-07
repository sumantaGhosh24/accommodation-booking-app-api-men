import mongoose, {Document} from "mongoose";

import {IHotel} from "./hotelModel";
import {IUser} from "./userModel";

export interface IRating extends Document {
  hotel: IHotel;
  user: IUser;
  comment: string;
  rating: number;
}

const ratingSchema = new mongoose.Schema(
  {
    hotel: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Hotel"},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    comment: {type: String, required: true},
    rating: {type: Number, required: true},
  },
  {timestamps: true}
);

const Rating = mongoose.model<IRating>("Rating", ratingSchema);

export default Rating;
