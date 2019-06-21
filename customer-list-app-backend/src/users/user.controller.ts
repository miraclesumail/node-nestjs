import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, HttpCode, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginInterceptor, LogInterceptor } from '../interceptors/time.interceptor'
import { Format } from '../tool'

class LoginUserDTO {
    readonly user_name: string;
    readonly email: string;
}

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    // add a customer
    @Post('/create')
    async addCustomer(@Res() res, @Body() createUserDTO: CreateUserDTO) {
        const user = await this.userService.addUser(createUserDTO);
        return res.status(200).json({
            message: "User has been created successfully",
            user
        })
    }

    @UseInterceptors(LogInterceptor)
    @Post('/login')
    async userLogin(@Res() res, @Body() loginUserDTO: LoginUserDTO) {
       const user =  await this.userService.getUser(loginUserDTO.user_name);
       if(!user)
            return res.status(HttpStatus.OK).json({
                msg:'用户不存在'
            })

       if(user.email != loginUserDTO.email) {
            const time = Format("yyyy-MM-dd hh:mm:ss");
            await this.userService.addUserStatus({
                  user_name: loginUserDTO.user_name,
                  action: 'login',
                  status: 0,
                  time
            })
            return res.status(HttpStatus.OK).json({
                msg:'用户名和邮箱不一致'
            })
       }
              
    }
}