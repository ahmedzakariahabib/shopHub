import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import dotenv from "dotenv";
import { bootstrap } from "./src/modules/index.routes.js";
dotenv.config();
const app = express();
const port = 3000;
app.use(express.json());
app.use("/uploads", express.static("uploads"));
bootstrap(app);
dbConnection();
app.listen(port, () =>
  console.log(`E-commerce app listening on port ${port}!`)
);
