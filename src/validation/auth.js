import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Username should be a string',
    'any.required': 'Username is required',
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid address with .com or .net domain',
      'any.required': 'Email is required',
    }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password cannot be empty.',
    'any.required': 'Password is required.',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});
