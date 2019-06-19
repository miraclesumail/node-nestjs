import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from './interfaces/customer.interface';
import { Movie } from './interfaces/movie.interface';
import { Time } from './interfaces/time.interface';
import { Lottery } from './interfaces/lottery.interface';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { CreateLotteryDTO } from './dto/create-lottery.dto';
import { TestService } from './test.service'
const TokenGenerator = require('uuid-token-generator');

@Injectable()
export class CustomerService {
    public numbers: Number[] = [];

    // 这里的Customer 在mongodb里面就是customers
    constructor(@InjectModel('Customer') private readonly customerModel: Model<Customer>,
    @InjectModel('Movie') private readonly movieModel: Model<Movie>, @InjectModel('Time') private readonly timeModel: Model<Time>, 
    @InjectModel('Lottery') private readonly lotteryModel: Model<Lottery>) {
        // const movie = new movieModel({
        //       name: 'ffffff',
        //       director: 'hhhhhhh',
        //       actor: 'bbbbbb'
        // })      
        
        // const customer = new customerModel({
        //         first_name: 'owowoww',
        //         last_name: 'fkkfkfkfkf',
        //         email: 'eeee@.com',
        //         phone: '393929292',
        //         movies: [movie._id]
        // })

        // customer.save((err) => {})
     }

    addNumber() {
        this.numbers.push(Math.random()*10);
    }  

    // fetch all customers
    async getAllCustomer(): Promise<Customer[]> {
        const customers = await this.customerModel.find().exec();
        return customers;
    }

    async getAllTime(): Promise<Time[]> {
        const timers = await this.timeModel.find().exec();
        return timers;
    }

    async getAllMovie(): Promise<Movie[]> {
        const movie = await this.movieModel({
              name: 'erwrwr',
              director: 'wrwrwr',
              actor: 'werwerwr'
        })  
        const mm = await movie.save();
        console.log(mm);

        // const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
        // const name = tokgen.generate();
        // const customer = await this.customerModel({
        //         first_name: name,
        //         last_name: '124rewr',
        //         email: 'gregeg',
        //         phone: '2453525',
        //         movies: [mm._id]
        // })
        // await customer.save();

        const customer = await this.customerModel.findOne({email: 'gregeg'}).exec();
        console.log(customer);
        customer.movies.push(mm._id);

        await customer.save();

        this.customerModel.findOne({email: 'gregeg'}).populate('movies').exec((err, customer) => {
            console.log(customer.movies);
        })
      
        const movies = await this.movieModel.find().exec();
        return movies;
    }

    // Get a single customer
    async getCustomer(customerID): Promise<Customer> {
        const customer = await this.customerModel.findById(customerID).exec();
        return customer;
    }

    // post a single customer
    async addCustomer(createCustomerDTO: CreateCustomerDTO): Promise<Customer> {
        const newCustomer = await this.customerModel(createCustomerDTO);
        return newCustomer.save();
    }

    // post a single lottery
    async addLottery(createLotteryDTO: CreateLotteryDTO[]): Promise<Lottery> {
        while(createLotteryDTO.length){
             const lottery = createLotteryDTO.shift();
             const newLottery = await this.lotteryModel(lottery);
             await newLottery.save();
        }
        return Promise.resolve({game:'重庆时时彩', wanfa:'直选 五星1', gameId:123, date:'2019-02-11', content:'fwtwtwtetet', beishu:2, zushu:1, sum:4});
    }

    // Edit customer details
    async updateCustomer(customerID, createCustomerDTO: CreateCustomerDTO): Promise<Customer> {
        const updatedCustomer = await this.customerModel
            .findByIdAndUpdate(customerID, createCustomerDTO, { new: true });
        return updatedCustomer;
    }

    // Delete a customer
    async deleteCustomer(customerID): Promise<any> {
        const deletedCustomer = await this.customerModel.findByIdAndRemove(customerID);
        return deletedCustomer;
    }

}
