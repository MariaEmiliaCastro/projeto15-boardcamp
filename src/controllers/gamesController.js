import connection from "../db/postgres.js";

const games = {
    
    getAllGames: async (req, res) => {
        try {
            const params = req.query;

            console.log(params.name);

            if(params.name) {
                const query = await connection.query(
                    'SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE $1', [`%${params.name}%`]);
                res.send(query.rows);
            }else{
                const query = await connection.query('SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id');
                res.send(query.rows);
            }
        } catch (error) {
            console.log(error);
        }  
    },
    postGame: async (req, res) => {
        try {
            const gameInfo = req.body;
            const gameCategoryName = req.locals.gameCategory;

            const query = await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', 
                                                    [gameInfo.name, gameInfo.image, gameInfo.stockTotal, gameInfo.categoryId, gameInfo.pricePerDay]);

            res.sendStatus(201);
        } catch (error) {
            console.log(error);
        }
    }
}

export default games;