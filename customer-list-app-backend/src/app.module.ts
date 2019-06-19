import { Module, DynamicModule, NestMiddleware } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerModule } from './customer/customer.module';
import { UserModule } from './users/user.module'
import { TestModule } from './test/test.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mydb', { useNewUrlParser: true }),
    CustomerModule,
    TestModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

// @Module({
//   providers: [Connection],
// })
// export class DatabaseModule {
//   static forRoot(entities = [], options?): DynamicModule {
//     const providers = createDatabaseProviders(options, entities);
//     return {
//       module: DatabaseModule,
//       providers: providers,
//       exports: providers,
//     };
//   }

//   @Module({
//     imports: [DatabaseModule.forRoot([User])],
//   })

// Note that the dynamic module extends (rather than overrides) the base module metadata. That's how both the statically declared Connection provider and the dynamically configured repository providers are exported from the module.

