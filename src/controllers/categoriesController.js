import connection from "../db/postgres.js";

const categories = {

    getCategories: async (req, res) => {
        try {
            const query = await connection.query('SELECT * FROM categories');
    
            res.send(query.rows);
        } catch (error) {
            console.log(error);
        }    
        
    },
    postCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const query = await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
            res.send(query.rows);
        } catch (error) {
            console.log(error);
        }
    }
}

export default categories;