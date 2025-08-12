import mongoose, { Schema } from "mongoose";

export const DEFAULT_USER_AVATAR =
  "https://res.cloudinary.com/dv3qbj0bn/image/upload/v1741416419/lastminprep/qnzy9jiix6hyfrr4cddx.png";

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: DEFAULT_USER_AVATAR,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    default: "",
  },
  codeExpiry: Date,
  profile: {
    type: Schema.Types.ObjectId,
    ref: "profile",
  },
  limits: {
    daily: {
      type: Number,
      default: 10,
    },
    weekly: {
      type: Number,
      default: 60,
    },
    monthly: {
      type: Number,
      default: 200,
    },
  },
  usage: [Date],
  loginType: {
    type: String,
    default: "email",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
