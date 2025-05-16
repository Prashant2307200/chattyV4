import Joi from "joi";

const chatSchema = Joi.object({

  participants: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).required())
    .min(2)
    .required()
    .messages({
      "array.base": "Participants must be an array.",
      "array.min": "At least two participant is required.",
      "string.pattern.base": "Each participant must be a valid ObjectId.",
    }),
  
  messages: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .messages({
      "array.base": "Messages must be an array.",
      "string.pattern.base": "Each message must be a valid ObjectId.",
    }),
});

export default chatSchema;