import connection from "../db/postgres.js";
import rentalsSchema from "../schemas/rentalsSchema.js";

const rentalsMiddleware = {

    validateRequestBody: async (req, res, next) => {
        try {
            const rentalInfo = req.body;

            const { error } = rentalsSchema.validate(rentalInfo);
    
            if(error){
                console.log(error);
                return res.sendStatus(400);
            }else{
                res.locals.rentalInfo = rentalInfo;
                next();
            }            
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }

    },
    validateIfRentalCanBeRegistered: async (req, res, next) => {
        try {
            const rentalGameId = res.locals.rentalInfo.gameId;
            const rentalCustomerId = res.locals.rentalInfo.customerId;
    
            const queryCustomer = await connection.query('SELECT * FROM customers WHERE id = $1', [rentalCustomerId]);
            const queryGame = await connection.query('SELECT * FROM games WHERE id = $1', [rentalGameId]);
    
            if(queryCustomer.rowCount === 0 || queryGame.rowCount === 0){
                return res.sendStatus(400);
            }else{
                const queryRentedGames = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" = null', [rentalGameId]);
                if(queryRentedGames.rowCount >= queryGame.rows[0].stockTotal){
                    return res.sendStatus(400);
                }
                next();
            }   
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    },
    validateIfRentalExists: async (req, res, next) => {
        try {
            const rentalId = req.params.id;
    
            const queryRental = await connection.query('SELECT * FROM rentals WHERE id = $1', [rentalId]);
    
            if(queryRental.rowCount > 0){
                next();
            }else{
                return res.sendStatus(404);
            }   
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    },
    validateIfRentalHasNotBeenReturned: async (req, res, next) => {
        try {
            const rentalId = req.params.id;
    
            const queryRental = await connection.query('SELECT * FROM rentals WHERE id = $1', [rentalId]);
    
            if(queryRental.rows[0].returnDate === null){
                next();
            }else{
                return res.sendStatus(400);
            }   
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }
}

export default rentalsMiddleware;