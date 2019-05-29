import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, HttpCode } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { CreateLotteryDTO } from './dto/create-lottery.dto';

class Test {
    readonly email: string;
    readonly phone: string; 
}

@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) { }

    // Retrieve customers list
    @Get('customers')
    async getAllCustomer(@Res() res) {
        this.customerService.addNumber();
        const customers = await this.customerService.getAllCustomer();
        return res.status(HttpStatus.OK).json(customers);
    }

    @Get('times')
    async getAllTimes(@Res() res) {
        const times = await this.customerService.getAllTime();
        return res.status(HttpStatus.OK).json(times);
    }

    @Get('movies')
    @HttpCode(204)
    async getAllMovie(@Res() res) {
        const movies = await this.customerService.getAllMovie();

        return res.status(HttpStatus.OK).json({qq:'sss', data:'sss', array: this.customerService.numbers});
       // return res.status(HttpStatus.OK).json(movies);
    }

    // test 会把query ？后面的都变成map  
    @Get('test')
    async getTest(@Res() res, @Query() test: Test) {
        return res.status(HttpStatus.OK).json([{qq:'sss', data:'sss'}]);
    }

    // Fetch a particular customer using ID
    @Get('customer/:customerID')
    async getCustomer(@Res() res, @Param('customerID') customerID) {
        const customer = await this.customerService.getCustomer(customerID);
        if (!customer) throw new NotFoundException('Customer does not exist!');
        return res.status(HttpStatus.OK).json(customer);
    }

    // add a customer
    @Post('/create')
    async addCustomer(@Res() res, @Body() createCustomerDTO: CreateCustomerDTO) {
        const customer = await this.customerService.addCustomer(createCustomerDTO);
        return res.status(HttpStatus.OK).json({
            message: "Customer has been created successfully",
            customer
        })
    }

    @Post('/createLottery')
    async addLottery(@Res() res, @Body() createLotteryDTO: CreateLotteryDTO[]) {
        console.log('psiisisisisiwwwee');
        const lottery = await this.customerService.addLottery(createLotteryDTO);
        return res.status(HttpStatus.OK).json({
            message: "Lottery has been created successfully",
            lottery
        })
    }

    // Update a customer's details
    @Put('/update')
    async updateCustomer(@Res() res, @Query('customerID') customerID, @Body() createCustomerDTO: CreateCustomerDTO) {
        const customer = await this.customerService.updateCustomer(customerID, createCustomerDTO);
        if (!customer) throw new NotFoundException('Customer does not exist!');
        return res.status(HttpStatus.OK).json({
            message: 'Customer has been successfully updated',
            customer
        });
    }

    // Delete a customer
    @Delete('/delete')
    async deleteCustomer(@Res() res, @Query('customerID') customerID) {
        const customer = await this.customerService.deleteCustomer(customerID);
        if (!customer) throw new NotFoundException('Customer does not exist');
        return res.status(HttpStatus.OK).json({
            message: 'Customer has been deleted',
            customer
        })
    }
}
