import joi from 'joi';

// {
//     id: 1,
//     name: 'Banco Imobiliário',
//     image: 'http://',
//     stockTotal: 3,
//     categoryId: 1,
//     pricePerDay: 1500,
// }

const gamesSchema = joi.object().keys({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().integer().min(1).required(),
    categoryId: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().required(),
});

export default gamesSchema;