import { Router } from "express";
import categoriesRoute from "./categoriesRoutes.js";

const router = Router();

router.use(categoriesRoute);



export default router;