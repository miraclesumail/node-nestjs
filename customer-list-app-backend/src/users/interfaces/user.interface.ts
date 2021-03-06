import { Document } from 'mongoose';

export interface User extends Document {
    readonly user_name: string;
    readonly email: string;
    readonly phone: string;
    readonly age: number;
    readonly gender: string;
    readonly address: string;
    readonly description: string;
    readonly created_at: string;
    readonly token: string;
}
