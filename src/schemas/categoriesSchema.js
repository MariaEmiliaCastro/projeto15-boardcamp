import joi from 'joi';

const categorySchema = joi.object().keys({
    name: joi.string().required()
});

export default categorySchema;