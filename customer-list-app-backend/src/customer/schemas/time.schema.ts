import * as mongoose from 'mongoose';

export const TimeSchema = new mongoose.Schema({
    duration: Number,
    number: Number
})