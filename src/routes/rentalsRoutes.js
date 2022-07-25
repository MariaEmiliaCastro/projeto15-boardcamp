import { Router } from "express";
import rentals from "../controllers/rentalsController.js";
import rentalsMiddleware from "../middlewares/rentalsMiddleware.js";

const rentalsRoute = Router();

rentalsRoute.get("/rentals", rentals.getRentals);
rentalsRoute.post("/rentals", rentalsMiddleware.validateRequestBody, rentalsMiddleware.validateIfRentalCanBeRegistered, rentals.postRental);
rentalsRoute.post("/rentals/:id/return", rentalsMiddleware.validateIfRentalExists, rentalsMiddleware.validateIfRentalHasNotBeenReturned, rentals.returnRental);
rentalsRoute.delete("/rentals/:id", rentalsMiddleware.validateIfRentalExists, rentalsMiddleware.validateIfRentalHasNotBeenReturned, rentals.deleteRental);

export default rentalsRoute;