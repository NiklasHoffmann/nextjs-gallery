import { Document } from 'mongoose';

// Base Mongoose Document
export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

// User Document
export interface IUser extends BaseDocument {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
}
