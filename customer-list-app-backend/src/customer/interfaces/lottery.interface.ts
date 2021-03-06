import { Document } from 'mongoose';

export interface Lottery extends Document {
    readonly game: String;
    readonly wanfa: String;
    readonly gameId: Number;
    readonly date: String;
    readonly content: String;
    readonly beishu: Number;
    readonly zushu: Number;
    readonly sum: Number;
}