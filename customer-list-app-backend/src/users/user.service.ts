import { Injectable, Inject, Res } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface'
import { UserStatus } from './interfaces/user-status.interface'
import { CreateUserDTO } from './dto/create-user.dto';
import { UserStatusDTO } from './dto/user-status.dto';
import { Format } from '../tool'

const TokenGenerator = require('uuid-token-generator');

@Injectable()
export class UserService {

    // 这里的Customer 在mongodb里面就是customers
    constructor(@InjectModel('User') private readonly userModel: Model<User>, @InjectModel('UserStatus') private readonly userStatusModel: Model<UserStatus>,
    ) {
       
    }

   
     // post a single lottery
     async addUser(createUserDTO: CreateUserDTO): Promise<String> {
            const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
            const token = tokgen.generate();
            // -> 'x6GCX3aq9hIT8gjhvO96ObYj0W5HBVTsj64eqCuVc5X'
            console.log(createUserDTO);
            const newUser = await this.userModel({...createUserDTO, token});
            await newUser.save();
            const userStatusDTO = {
                  user_name: createUserDTO.user_name,
                  action: 'sing-up',
                  status: 1,
                  time: Format("yyyy-MM-dd hh:mm:ss")
            }
            await this.addUserStatus(userStatusDTO);
        return Promise.resolve(newUser);
    }

    // Get a single customer
    async getUser(userName): Promise<User> {
        const user = await this.userModel.find({user_name: userName}).exec();
        return Promise.resolve(user);
    }

     // post a single lottery
     async addUserStatus(userStatusDTO: UserStatusDTO): Promise<String> {
        const newUserStatus = await this.userStatusModel(userStatusDTO);
        await newUserStatus.save();
        return Promise.resolve('newUser');
     }

     async setUserNull(userName): Promise<Boolean> {
         await this.userModel.updateOne({user_name: userName}, {token:null});
         return Promise.resolve(true);
     }

     async getUserStatus(userName): Promise<UserStatus> {
         const userStatus = await this.userStatusModel.find({
             user_name: userName,
             action: { $in: ['sing-up', 'login'] }
         }).limit(10).sort({ time: -1 }).exec();

         return Promise.resolve(userStatus);
     }
}
