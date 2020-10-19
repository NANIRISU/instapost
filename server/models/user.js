// schema is blue print we store this data in db
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/drlqvm95z/image/upload/v1602572373/upload_defulat_se17nk.png",
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
});
mongoose.model("User", userSchema);
