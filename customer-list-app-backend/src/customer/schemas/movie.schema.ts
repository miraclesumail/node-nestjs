import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const MovieSchema = new mongoose.Schema({
    name: String,
    director: String,
    actor: String
   // customer: { type: Schema.Types.ObjectId, ref: 'Customer' }
})