import { Document } from 'mongoose';

export interface Time extends Document {
    readonly duration: Number;
    readonly time: Number;
}