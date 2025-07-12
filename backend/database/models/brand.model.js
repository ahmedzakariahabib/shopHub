import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    logo: String,
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

schema.post("init", function (doc) {
  doc.logo = process.env.baseURL + "uploads/" + doc.logo;
});

export const brandModel = mongoose.model("brand", schema);
