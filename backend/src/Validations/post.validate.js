import Joi from "joi";

export const validateCreatePost = (data) => {
    const schema = Joi.object({
        post_id: Joi.string().required(),
        title: Joi.string().required(),
        content: Joi.string().required(),
    })
    return schema.validate(data, { errors: { wrap: { label: false } } });
}