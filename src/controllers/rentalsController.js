import connection from "../db/postgres.js";

const rentals = {

    getRentals: async (req, res) => {

        try {
            const params = req.query;

            if(params.customerId) {
                const rentals = await connection.query(`
                    SELECT rentals.*, customers.name, customers.id as customerident, games.name as gamename, games.id as gameident
                    FROM rentals 
                    JOIN customers 
                    ON rentals."customerId" = customers.id
                    JOIN games
                    ON rentals."gameId" = games.id
                    WHERE rentals."customerId" = $1
                `, 
                [params.customerId]);

                let filteredRentals = rentals.rows.map(rental => ({...rental, rentDate: rental.rentDate.toISOString().split('T')[0], customer: {id: rental.customerident, name: rental.name}, game: {id: rental.gameident, name: rental.gamename}}));
                filteredRentals = filteredRentals.map(({customerident, gamename, gameident, name, ...rental}) => rental);
                res.status(200).json(filteredRentals);
            }else if (params.gameId) {
                const rentals = await connection.query(`
                    SELECT rentals.*, customers.name, customers.id as customerident, games.name as gamename, games.id as gameident
                    FROM rentals 
                    JOIN customers 
                    ON rentals."customerId" = customers.id
                    JOIN games
                    ON rentals."gameId" = games.id
                    WHERE rentals."gameId" = $1
                `, 
                [params.gameId]);

                let filteredRentals = rentals.rows.map(rental => ({...rental, rentDate: rental.rentDate.toISOString().split('T')[0], customer: {id: rental.customerident, name: rental.name}, game: {id: rental.gameident, name: rental.gamename}}));
                filteredRentals = filteredRentals.map(({customerident, gamename, gameident, name, ...rental}) => rental);
                res.status(200).json(filteredRentals);
            }else{
                const rentals = await connection.query(`
                    SELECT rentals.*, customers.name, customers.id as customerident, games.name as gamename, games.id as gameident
                    FROM rentals 
                    JOIN customers 
                    ON rentals."customerId" = customers.id
                    JOIN games
                    ON rentals."gameId" = games.id
                `);

                let filteredRentals = rentals.rows.map(rental => ({...rental, rentDate: rental.rentDate.toISOString().split('T')[0], customer: {id: rental.customerident, name: rental.name}, game: {id: rental.gameident, name: rental.gamename}}));
                filteredRentals = filteredRentals.map(({customerident, gamename, gameident, name, ...rental}) => rental);
                res.status(200).json(filteredRentals);
            }  
        } catch (error) {
            console.log(error);
        }
    },
    postRental: async (req, res) => {
        
        try {
            let rentalInfo = req.body;

            const queryGameRentPrice = await connection.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [rentalInfo.gameId]);

            console.log(queryGameRentPrice.rows[0].pricePerDay);

            rentalInfo = {...rentalInfo, rentDate: new Date().toISOString().split('T')[0], daysRented: rentalInfo.daysRented, returnDate: null, originalPrice: (queryGameRentPrice.rows[0].pricePerDay * rentalInfo.daysRented), delayFee: null};

            console.log(rentalInfo);
            
            const query = await connection.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [rentalInfo.customerId, rentalInfo.gameId, rentalInfo.rentDate, rentalInfo.daysRented, rentalInfo.returnDate, rentalInfo.originalPrice, rentalInfo.delayFee]);
            
            res.sendStatus(201);
        } catch (error) {
            console.log(error);
        }
    },
    returnRental: async (req, res) => {
        try {
            const rentalId = req.params.id;
            const returnDate = new Date().toISOString().split('T')[0];
            const query = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [rentalId]);
            const maxReturnDate = new Date(query.rows[0].rentDate).setDate(new Date(query.rows[0].rentDate).getDate() + query.rows[0].daysRented);

            if(new Date(returnDate) > new Date(maxReturnDate)) {

                const delayFee = Math.round((new Date(returnDate) - new Date(maxReturnDate)) / (1000 * 60 * 60 * 24)) * (query.rows[0].originalPrice / (query.rows[0].daysRented));
                console.log(delayFee);
                const querySetDelayFee = await connection.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [returnDate, delayFee, rentalId]);            

                return res.sendStatus(200);
            }else{
                const query = await connection.query(`UPDATE rentals SET "returnDate" = $1 WHERE id = $2`, [returnDate, rentalId]);
                return res.sendStatus(200);
            }
        } catch (error) {
            console.log(error);
        }
    },
    deleteRental: async (req, res) => {
        try {
            const rentalId = req.params.id;

            const queryToVerifyIfRentalIsReturned = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [rentalId]);

            if(queryToVerifyIfRentalIsReturned.rows[0].returnDate) {
                return res.sendStatus(400);
            }
            
            const query = await connection.query(`DELETE FROM rentals WHERE id = $1`, [rentalId]);
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
        }
    }
}

export default rentals;