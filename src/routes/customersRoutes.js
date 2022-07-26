import { Router } from "express";
import customers from "../controllers/customersController.js";
import validateCustomersMiddleware from "../middlewares/customersMiddleware.js";

const customersRoute = Router();

customersRoute.get('/customers', customers.getCustomers);
customersRoute.get('/customers/:id', customers.getCustomerById);
customersRoute.post('/customers', validateCustomersMiddleware.validateRequestBody, validateCustomersMiddleware.validateIfCustomerCanBeRegistered, customers.postCustomer);
customersRoute.put('/customers/:id', validateCustomersMiddleware.validateRequestBody, validateCustomersMiddleware.validateIfCustomerExists, customers.updateCustomer);

export default customersRoute;