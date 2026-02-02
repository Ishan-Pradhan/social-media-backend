import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";

const profileSchema = new Schema(
  {
    coverImage: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0gzQgDQEELoFutX1S63C.jpg`,
        localPath: "",
      },
    },
    firstName: {
      type: String,
      default: "John",
    },
    lastName: {
      type: String,
      default: "Doe",
    },
    bio: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      default: "",
    },
    countryCode: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SocialProfile = mongoose.model("SocialProfile", profileSchema);
