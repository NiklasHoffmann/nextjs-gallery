// Generic Types
export type Locale = 'de' | 'en';

export interface BaseModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
