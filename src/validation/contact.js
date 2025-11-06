import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+[0-9]+$/)
    .min(6)
    .max(16)
    .required()
    .messages({
      'string.base': 'Phone number must be a string',
      'string.pattern.base':
        'Phone number must start with + and contain only digits',
      'string.min': 'Phone number must be at least 6 characters long',
      'string.max': 'Phone number must not be longer than 16 characters',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid address with .com or .net domain',
      'any.required': 'Email is required',
    }),
  isFavourite: Joi.boolean().required().messages({
    'boolean.base': 'isFavourite must be true or false',
    'any.required': 'isFavourite is required',
  }),
  contactType: Joi.string()
    .valid('personal', 'home', 'work')
    .required()
    .min(3)
    .max(20)
    .messages({
      'string.base': 'contactType must be a string',
      'any.only': 'contactType must be one of [personal, home, work]',
      'any.required': 'contactType is required',
    }),
});

export const updateContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+[0-9]+$/)
    .min(6)
    .max(16)
    .messages({
      'string.base': 'Phone number must be a string',
      'string.pattern.base':
        'Phone number must start with + and contain only digits',
      'string.min': 'Phone number must be at least 6 characters long',
      'string.max': 'Phone number must not be longer than 16 characters',
      'any.required': 'Phone number is required',
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .min(3)
    .max(20)
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Email must be a valid address with .com or .net domain',
    }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be true or false',
  }),
  contactType: Joi.string()
    .valid('personal', 'home', 'work')
    .min(3)
    .max(20)
    .messages({
      'string.base': 'contactType must be a string',
      'any.only': 'contactType must be one of: personal, home, work',
    }),
});
