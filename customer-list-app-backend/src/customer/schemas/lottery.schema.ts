import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const LotterySchema = new mongoose.Schema({
    game: String,
    wanfa: String,
    gameId: Number,
    date: String,
    content: String,
    beishu: Number,
    zushu: Number,
    sum: Number
})