import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, HttpCode, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginInterceptor } from '../interceptors/time.interceptor'

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
}