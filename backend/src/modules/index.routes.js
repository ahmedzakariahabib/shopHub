import { globalError } from "../middleware/globalError.js";
import categoryRouter from "./category/category.routes.js";
import subCategoryRouter from "./subcategory/subcategory.routes.js";
export const bootstrap = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.get("/", (req, res) => res.send("Hello with E-commerce App!"));
  app.use(globalError);
};
