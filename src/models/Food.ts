import mongoose, { Schema, Document } from "mongoose";

export interface FoodDoc extends Document {
  vendorID: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: number;
  images: [string];
} 

const FoodSchema = new Schema({
  vendorId: {type: String},
  name: {type: String, required: true},
  description: {type: String, required: true},
  category: {type: String, required: true},
  foodType: {type: String, required: true},
  readyTime: {type: Number},
  price: {type: Number, required: true},
  rating: {type: Number},
  images: {type: [String]},
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret._v,
      delete ret.createAt,
      delete ret.updateAt
    }
  },
  timestamps: true
})

const food = mongoose.model<FoodDoc>('food', FoodSchema)
export {food}