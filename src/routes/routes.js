import { Router } from "express";
import categoriesRoute from "./categoriesRoutes.js";
import gamesRoute from "./gamesRoutes.js";

const router = Router();

router.use(categoriesRoute);
router.use(gamesRoute);

export default router;