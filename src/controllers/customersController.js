import connection from "../db/postgres.js";

const customers = {

    getCustomers: async (req, res) => {
        try {
            const params = req.query;

            if(params.name) {
                const query = await connection.query(
                    'SELECT * FROM customers WHERE cpf ILIKE $1', [`%${params.cpf}%`]);
                    const customerInfo = query.rows.map((data, { birthday }) => ({...data, birthday: data.birthday.toISOString().split('T')[0]}));
                res.send(customerInfo);
            }else{
                const query = await connection.query('SELECT * FROM customers');

                const customerInfo = query.rows.map((data, { birthday }) => ({...data, birthday: data.birthday.toISOString().split('T')[0]}));

                res.send(customerInfo);
            }
        } catch (error) {
            console.log(error);
        }
    },
    getCustomerById: async (req, res) => {
        try {
            const customerId = req.params.id;

            const query = await connection.query(
                'SELECT * FROM customers WHERE id = $1',
                [customerId]
            );

            if(query.rowCount > 0){
                const customerInfo = query.rows.map((data, { birthday }) => ({...data, birthday: data.birthday.toISOString().split('T')[0]}));
                return res.send(customerInfo);
            }else{
                return res.sendStatus(404);
            }
            
        } catch (error) {
           console.log(error); 
        }
    },
    postCustomer: async (req, res) => {
        try {
            const customerInfo = req.body;
            const query = await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)',
            [
                customerInfo.name,
                customerInfo.phone,
                customerInfo.cpf,
                customerInfo.birthday
            ])
            
            return res.sendStatus(201);
        } catch (error) {
            console.log(error)
            res.sendStatus(400);
        }
    },
    updateCustomer: async (req, res) => {
        try {
            const customerInfo = req.body;
            const customerId = req.params.id;
            
            const query = await connection.query('UPDATE customers SET (name, phone, cpf, birthday) = ($1, $2, $3, $4) WHERE id = $5',
            [
                customerInfo.name,
                customerInfo.phone,
                customerInfo.cpf,
                customerInfo.birthday,
                customerId                
            ])

            res.sendStatus(200);
        } catch (error) {
            console.log(error)
        }
  }
}

export default customers;