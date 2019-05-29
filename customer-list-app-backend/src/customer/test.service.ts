import { Injectable } from '@nestjs/common';



@Injectable()
export class TestService {
    public numbers: Number[] = [];

   
    say() {
        console.log('from test');
    }  
}
