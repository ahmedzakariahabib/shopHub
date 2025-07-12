import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short category name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    image: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
//init return object with object
//find instead of init will return array of objects and we  need init
schema.post("init", function (doc) {
  doc.image = process.env.baseURL + "uploads/" + doc.image;
});

export const categoryModel = mongoose.model("category", schema);
