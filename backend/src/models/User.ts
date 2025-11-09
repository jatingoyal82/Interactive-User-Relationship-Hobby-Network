import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
}

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [1, 'Username must be at least 1 character'],
    maxlength: [50, 'Username cannot exceed 50 characters'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    max: [150, 'Age cannot exceed 150'],
  },
  hobbies: {
    type: [String],
    required: true,
    default: [],
    validate: {
      validator: (hobbies: string[]) => {
        return hobbies.every((hobby) => hobby.trim().length > 0);
      },
      message: 'Hobbies cannot contain empty strings',
    },
  },
  friends: {
    type: [String],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  popularityScore: {
    type: Number,
    default: 0,
  },
});

// Index for faster queries
UserSchema.index({ id: 1 });
UserSchema.index({ username: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);

