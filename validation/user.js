 var Joi = require('joi');

module.exports = {
			firstName: Joi.string().alphanum().min(2).max(30).required(),
			lastName: Joi.string().alphanum().min(2).max(30).required(),
			address1: Joi.string().alphanum().min(3).max(50).required(),
			address2: Joi.string().alphanum().min(3).max(50).required(),
			city: Joi.string().alphanum().min(2).max(30).required(),		
			state: Joi.string().alphanum().min(2).max(2).required(),
			zipCode: Joi.string().regex(/^\d{5}(?:[-\s]\d{4})?$/).alphanum().min(5).max(10).required()
	};