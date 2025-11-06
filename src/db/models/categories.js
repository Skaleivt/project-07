import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const categoriesCollection = model('categories', categorySchema);
