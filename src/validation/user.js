import Joi from 'joi';

export const updateUserValidationSchema = Joi.object({
  name: Joi.string().min(2).max(30).optional().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be less than 30 characters',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email',
  }),

  avatarUrl: Joi.string().uri().optional().messages({
    'string.uri': 'Avatar must be a valid URL',
  }),
}).min(1);

export const addSavedStoryValidationSchema = Joi.object({
  storyId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid storyId format',
      'any.required': 'storyId is required',
    }),
});
