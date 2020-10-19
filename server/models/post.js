const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],

    postedBy: {
      type: ObjectId, // this creating releationship between user model to objecteId
      ref: "User",
    },
  },
  { timestamps: true }
);

mongoose.model("Post", postSchema);
