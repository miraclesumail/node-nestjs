import { Module, Global, NestMiddleware, Injectable, NestModule, MiddlewareConsumer, HttpStatus, RequestMethod} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserStatusSchema } from './schemas/user-status.schema'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'UserStatus', schema: UserStatusSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule{}


