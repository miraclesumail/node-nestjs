import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomerService } from './customer/customer.service'
 
@Controller()
export class AppController {
  // 这里的customerService和customer下面的是共用的
  constructor(private readonly appService: AppService, private readonly customerService: CustomerService) {}

  @Get()
  root(): string {
    console.log(this.customerService.numbers);
    return this.appService.root();
  }
}
