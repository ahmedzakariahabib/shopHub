import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      minLength: [2, "too short review text"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);
//=>>/^find/ any thing start with find
schema.pre(/^find/, function () {
  this.populate("user", "name");
});

export const reviewModel = mongoose.model("review", schema);
