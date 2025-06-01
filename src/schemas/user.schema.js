import Joi from 'joi';

const ROLEs = {
  Viewer: 0,
  Admin: 1,
};
 
const email = Joi.string()
  .trim()
  .lowercase()
  .email()
  .required();

const password = Joi.string()
  .min(6)
  .max(20)
  .pattern(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/)
  .required()
  .messages({
    'string.pattern.base': 'Password can include letters, numbers and special characters only.'
  });

export const userSchema = Joi.object({
  username: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z_]{3,18}$/)
    .required()
    .messages({
      'string.pattern.base': 'Username must be 3-18 characters and contain only letters and underscore.'
    }),
  email,
  password,
  roles: Joi.number()
    .valid(...Object.values(ROLEs))
    .default(ROLEs.Viewer)
});

export const userLoginSchema = Joi.object({
  email,
  password
});
