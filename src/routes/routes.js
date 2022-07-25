import { Router } from "express";
import categoriesRoute from "./categoriesRoutes.js";
import gamesRoute from "./gamesRoutes.js";
import customersRoute from "./customersRoutes.js";
import rentalsRoute from "./rentalsRoutes.js";

const router = Router();

router.use(categoriesRoute);
router.use(gamesRoute);
router.use(customersRoute);
router.use(rentalsRoute);

export default router;