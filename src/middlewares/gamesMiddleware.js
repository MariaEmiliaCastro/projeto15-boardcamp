import connection from "../db/postgres.js";
import gamesSchema from "../schemas/gamesSchema.js";

const validateGamesMiddleware = {

    validateRequestBody: async (req, res, next) => {
        try {
        
            const game = req.body;
            const { error } = gamesSchema.validate(game);
    
            if (error){
                return res.sendStatus(400);
            } else {
                req.locals = game;
                next();
            }
    
        } catch (error) {
            console.log(error);
        }
    },
    validateCategoryId: async (req, res, next) => {
        try {
            const game = req.locals;
            const queryCategory = await connection.query(`SELECT * FROM categories WHERE id = $1`, [game.categoryId]);
            console.log(queryCategory.rows);
            if(queryCategory.rows.length > 0) {
                req.locals.gameCategory = queryCategory.rows[0].name;
                next();
            }else{
                return res.sendStatus(400);
            }
        } catch (error) {
            console.log(error);
        }
    },
    validateIfNameAlreadyExists: async (req, res, next) => {
        try {
            const game = req.locals;
            const queryGameName = await connection.query('SELECT * FROM games WHERE name = $1', [game.name]);

            if (queryGameName.rowCount > 0){
                return res.sendStatus(409);
            }else{
                next();
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default validateGamesMiddleware;