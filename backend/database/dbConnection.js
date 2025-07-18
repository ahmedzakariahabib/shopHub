import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(
      "mongodb+srv://ecommerce:1zszyrXrTrThtHSD@cluster0.batt5ig.mongodb.net/E-commerce"
    )
    .then(() => console.log("Mongodb is connected"))
    .catch((err) => console.log("database error", err));
};
