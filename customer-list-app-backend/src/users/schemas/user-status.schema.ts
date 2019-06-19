import * as mongoose from 'mongoose';
export const UserStatusSchema = new mongoose.Schema({
    user_name: String,
    action: String,
    status: Number,
    time: String 
})