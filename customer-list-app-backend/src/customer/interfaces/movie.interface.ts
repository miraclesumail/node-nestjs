import { Document } from 'mongoose';

export interface Movie extends Document {
    readonly first_name: string;
    readonly last_name: string;
    readonly email: string;
}