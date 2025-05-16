import Joi from 'joi';
 
const requestValidationSchema = Joi.object({ 

  receiver: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Receiver must be a valid ObjectId.',
      'any.required': 'Receiver is required.',
    }),

  status: Joi.string()
    .valid('pending', 'accepted', 'declined')
    .default('pending')
    .messages({
      'any.only': 'Status must be one of [pending, accepted, declined].',
    }),
});

const responseValidationSchema = Joi.object({
  status: Joi.string()
    .valid('accepted', 'declined')
    .required()
    .messages({
      'any.only': 'Status must be either accepted or declined.',
      'any.required': 'Status is required.',
    }),
});

export { requestValidationSchema, responseValidationSchema };