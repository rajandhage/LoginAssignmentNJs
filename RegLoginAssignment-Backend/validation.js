const Joi = require('joi');

const registerValidation = (req) => {
    const schema = Joi.object({
        name : Joi.string().min(6).required(),
        email : Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
    });

    return schema.validate({name : req.body.name, email : req.body.email, password : req.body.password});
}

const loginValidation = (req) => {
    const schema = Joi.object({
        
        email : Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
    });

    return schema.validate({email : req.body.email, password : req.body.password});
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;