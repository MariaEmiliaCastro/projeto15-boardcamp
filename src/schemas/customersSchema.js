import joi from 'joi';

const customerSchema = joi.object().keys({
    name: joi.string().required(),
    phone: joi.string().pattern(new RegExp('^[0-9]{10,11}$')).required(),
    cpf: joi.string().pattern(new RegExp('^[0-9]{11}$')).required(),
    birthday: joi.date().greater('9-12-1830')
});

export default customerSchema;