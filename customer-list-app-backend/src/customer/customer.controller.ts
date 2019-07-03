import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, NotFoundException, Delete, Param, HttpCode, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from  'multer';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { CreateLotteryDTO } from './dto/create-lottery.dto';
import { LoginInterceptor } from '../interceptors/time.interceptor'
import { extname } from  'path';

const nodemailer = require('nodemailer');

// const getAsync = promisify(client.get).bind(client);
// const setAsync = promisify(client.set).bind(client);
// const setex = promisify(client.setex).bind(client);
// const ttl = promisify(client.ttl).bind(client);
// const incr = promisify(client.incr).bind(client);
  
class Test {
    readonly email: string;
    readonly phone: string; 
}

//@UseInterceptors(LoginInterceptor)
@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) { }

    // Retrieve customers list
    @UseInterceptors(LoginInterceptor)
    @Get('customers')
    async getAllCustomer(@Res() res) {
        this.customerService.addNumber();
        const customers = await this.customerService.getAllCustomer();
        return res.status(HttpStatus.OK).json(customers);
    }

    // @Get('testRedis')
    // async testRedis(@Res() res) {
    //     //   let msg = await getAsync('count');
    //     //   let time = await ttl('count');
    //     //   if(msg == 40 && time >= 0 ) {
    //     //       return res.status(HttpStatus.OK).json({msg: '超过次数限制'});
    //     //   } else {    
    //     //       msg && time ? await incr('count') : await setex('count', 20, 1);
    //     //       return res.status(HttpStatus.OK).json({msg: +await getAsync('count'), time: await ttl('count')});
    //     //   }
    //     client.setAsync('ww', 'axixii');
    //     client.setexAsync('www', 10, 'axi');
    //     //client.setAsync('ww', 'axixii');
    //     return res.status(HttpStatus.OK).json({msg: await client.getAsync('foo')});
    // }

    @Get('times')
    async getAllTimes(@Res() res) {
        const times = await this.customerService.getAllTime();
        return res.status(HttpStatus.OK).json(times);
    }

    // @Get('avatars/:fileId')
    //     async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    //     // res.sendFile(fileId, { root: 'avatars'});
    //     res.sendFile(fileId, { root: 'avatars'});
    // }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('file', 5,  {
        storage: diskStorage({
          destination: './avatars', 
          filename: (req, file, cb) => {
          const randomName = Array(12).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        }
        })
      }))
    uploadFile(@UploadedFiles() file) {
         console.log(file);
    }

    @Get('movies')
    @HttpCode(204)
    async getAllMovie(@Res() res) {
        // 开启一个SMTP连接
        let transporter = nodemailer.createTransport({
            // host: 'smtp.qq.com',
            service: 'qq', // 需要到qq邮箱设置开通SMTP, 查看支持的邮件服务商列表 https://nodemailer.com/smtp/well-known/
            port: 465, // SMTP 端口
            secureConnection: true, // 使用了SSL
            secure: true, // true for 465, false for other ports
            auth: {
                user: '857247710@qq.com',
                pass: 'vupdxtauyvzibcgf' // 这里密码不是qq密码，是你设置的smtp授权码
            }
        })

        // 填写邮件信息
        let mailOptions = {
            from: '"Fred Foo 👻" <857247710@qq.com>', // 发件人
            to: 'toby.zhao@kingbaly.me', // 收件人
            subject: '你是少时诵诗书所', // 标题
            // 发送text或者html格式
            text: '你是sdsd么么么么', // plain text body 文本格式的内容
            html: '' // html body HTML格式的内容
        };

        let info = await transporter.sendMail(mailOptions);
        console.log(info);

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
