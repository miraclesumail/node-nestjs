import { Module } from '@nestjs/common';
import CustomerController  from './test.controller';
import { CustomerService } from '../customer/customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from '../customer/schemas/customer.schema';
import { MovieSchema } from '../customer/schemas/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }, {name: 'Movie', schema: MovieSchema}])
  ],
  providers: [],
  controllers: [CustomerController]
})
export class TestModule {}
