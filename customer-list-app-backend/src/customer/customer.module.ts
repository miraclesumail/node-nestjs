import { Module, Global, NestMiddleware, Injectable, NestModule, MiddlewareConsumer} from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TestService } from './test.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './schemas/customer.schema';
import { MovieSchema } from './schemas/movie.schema';
import { TimeSchema } from './schemas/time.schema';
import { LotterySchema } from './schemas/lottery.schema';

// 这里使用了Global 那么该模块下的providers 都在所有module里面共享
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }, {name: 'Movie', schema: MovieSchema}, {name: 'Time', schema: TimeSchema},
                 { name: 'Lottery', schema: LotterySchema}])
  ],
  controllers: [CustomerController],
  providers: [CustomerService, TestService],
  exports: [CustomerService]  // 对外输出了provider

  /**
   * exports:  the subset of providers that provided by this module should be available in other modules who import this moudle
   * 
   * 
   */
})
export class CustomerModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(LoggerMiddleware)
        .forRoutes('customer');
    }
 }

function logger(req, res, next) {
    console.log(`Request...`);
    console.log(req);
    next();
}

@Injectable()
class LoggerMiddleware implements NestMiddleware{
  resolve() {
    return Promise.resolve(logger);
  }
}

