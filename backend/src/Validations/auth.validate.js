import Joi from "joi";
export const validateRegister = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
    return schema.validate(data, { errors: { wrap: { label: false } } });
}

export const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })

    return schema.validate(data, { errors: { wrap: { label: false } } });
}