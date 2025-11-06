import Joi from 'joi';
import mongoose from 'mongoose';

export const createStoryValidationSchema = Joi.object({
  img: Joi.binary()
    .max(2 * 1024 * 1024)
    .required()
    .messages({
      'any.required': 'Story image is required',
      'binary.max': 'Image must be less than 2MB',
    }),

  title: Joi.string().max(80).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must be less than 80 characters',
  }),

  description: Joi.string().max(2500).required().messages({
    'string.empty': 'Description is required',
    'string.max': 'Description must be less than 2500 characters',
  }),

  category: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation')
    .required()
    .messages({
      'any.required': 'Category is required',
      'any.invalid': 'Category must be a valid ObjectId',
    }),
});

export const refreshStoryValidationSchema = Joi.object({
  img: Joi.binary()
    .max(2 * 1024 * 1024)
    .messages({
      'binary.max': 'Image must be less than 2MB',
    }),

  title: Joi.string().max(80).messages({
    'string.max': 'Title must be less than 80 characters',
  }),

  description: Joi.string().max(2500).messages({
    'string.max': 'Description must be less than 2500 characters',
  }),

  category: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation')
    .messages({
      'any.invalid': 'Category must be a valid ObjectId',
    }),
});
