import Joi from 'joi';

export const messageSchema = Joi.object({  
  
  sender: Joi.string().required(), 
  
  chat: Joi.string().required(),
  
  text: Joi.string().min(1).allow("").optional(),

  image: Joi.string().uri().allow("").optional(),
  
}).or('text', 'image');



