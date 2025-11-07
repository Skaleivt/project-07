import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    articlesAmount: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    selectedStories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'stories',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const UsersCollection = model('user', userSchema);
