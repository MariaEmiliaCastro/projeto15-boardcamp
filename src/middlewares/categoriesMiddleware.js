import connection from "../db/postgres.js";
import categorySchema from "../schemas/categoriesSchema.js";

const validateCategoriesMiddleware = async (req, res, next) => {
    try {
        const { name } = req.body;
        const query = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
        const { error } = categorySchema.validate({ name });
        if (error) {
            res.status(400).send(error.details[0].message);
        } else if (query.rows.length > 0) {
            res.status(409).send("Category already exists");
        }else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

export default validateCategoriesMiddleware;


