import connection from "../db/postgres.js";
import customerSchema from "../schemas/customersSchema.js";

const validateCustomersMiddleware = {

    validateRequestBody: async (req, res, next) => {
        const customerInfo = req.body;

        const { error } = customerSchema.validate(customerInfo);

        if(error){
            console.log(error);
            return res.sendStatus(400);
        }else{
            res.locals.customerInfo = customerInfo;
            res.locals.customerId = req.params.id;
            next();
        }
    },
    validateIfCustomerAlreadyExists: async (req, res, next) => {
        const customerCpf = res.locals.customerInfo.cpf;

        const query = await connection.query('SELECT * FROM customers WHERE cpf = $1', [customerCpf]);

        if(query.rowCount > 0){
            return res.sendStatus(409);
        }else{
            next();
        }
    },
    validateUpdateCustomer: async (req, res, next) => {
        const customerCpf = res.locals.customerInfo.cpf;
        const customerId = res.locals.customerId;
        const query = await connection.query('SELECT * FROM customers WHERE cpf = $1', [customerCpf]);

        if(query.rowCount > 0){
            next();
        }else{
            return res.sendStatus(404);
        }
    }
}

export default validateCustomersMiddleware;