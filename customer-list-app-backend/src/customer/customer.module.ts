import { Module, Global, NestMiddleware, Injectable, NestModule, MiddlewareConsumer, HttpStatus, RequestMethod} from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TestService } from './test.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './schemas/customer.schema';
import { MovieSchema } from './schemas/movie.schema';
import { TimeSchema } from './schemas/time.schema';
import { LotterySchema } from './schemas/lottery.schema';

const bluebird = require('bluebird');

var redis = require("redis"), redis = bluebird.promisifyAll(redis), client = redis.createClient();

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
        .forRoutes({ path: 'customer/customers', method: RequestMethod.GET });
        //.forRoutes('customer');
    }
 }

async function logger(req, res, next) {
    console.log('开始杀死后四十杀死或撕毁Request...');
    let msg = await client.getAsync('count');
    let time = await client.ttlAsync('count');
    if(msg == 40) {
        return res.status(HttpStatus.OK).json({msg: '超过次数限制', time: +time});
    } else {    
        msg ? await client.incrAsync('count') : await client.setexAsync('count', 20, 1);
        // return res.status(HttpStatus.OK).json({msg: +await getAsync('count'), time: await ttl('count')});
    }
    next();
}

@Injectable()
class LoggerMiddleware implements NestMiddleware{
  resolve() {
    return Promise.resolve(logger);
  }
}

