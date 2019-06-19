import { Document } from 'mongoose';

export interface UserStatus extends Document {
    readonly user_name: string;
    readonly action: string; // 登录  注册  退出
    readonly status: number; // 0 失败 1 成功 
    readonly time: string // 操作时间
}