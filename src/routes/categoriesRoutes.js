import { Router } from "express";
import categories from "../controllers/categoriesController.js";
import validateCategoriesMiddleware from "../middlewares/categoriesMiddleware.js";

const categoriesRoute = Router();

categoriesRoute.get("/categories", categories.getCategories);
categoriesRoute.post("/categories", validateCategoriesMiddleware, categories.postCategory);

export default categoriesRoute;
