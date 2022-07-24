import { Router } from "express";
import games from "../controllers/gamesController.js";
import validateGamesMiddleware from "../middlewares/gamesMiddleware.js";

const gamesRoute = Router();

gamesRoute.get("/games", games.getAllGames);
gamesRoute.post("/games", validateGamesMiddleware.validateRequestBody, validateGamesMiddleware.validateCategoryId, validateGamesMiddleware.validateIfNameAlreadyExists, games.postGame);

export default gamesRoute;