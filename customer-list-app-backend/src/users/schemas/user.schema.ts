import * as mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
    user_name: String,
    email: String,
    phone: String,
    age: Number,
    gender: String,
    address: String,
    description: String,
    created_at: String,
    token: String
})