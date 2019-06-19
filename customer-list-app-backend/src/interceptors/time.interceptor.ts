import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Res } from '@nestjs/common';
import { UserService } from '../users/user.service'
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

// 如果不调用next.handle() 不会走到router的方法里面
@Injectable()
export class LoginInterceptor implements NestInterceptor {
       constructor(private userService:UserService){}

       async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
            console.log(context.getArgByIndex(0).res);
 
            console.log(context.getArgByIndex(0).query);
            const user = (await this.userService.getUser(context.getArgByIndex(0).query['user_name']))[0]; 
            console.log(user);
            if(!user.token) {
                context.getArgByIndex(0).res.status(200).json({msg: 'token过期了, 需要重新登录'});
                return;
            }
         
            const userStatus = (await this.userService.getUserStatus(context.getArgByIndex(0).query['user_name']))[0];
            console.log(userStatus);

            const now = Date.now();
            if((now - new Date(userStatus.time).getTime()) > 1000*15) {
                await this.userService.setUserNull(context.getArgByIndex(0).query['user_name']);
                context.getArgByIndex(0).res.status(200).json({msg: 'token过期了'});
                return;
            }
                 
            return next
              .handle()
              .pipe(
                tap(() => console.log(`After... ${Date.now() - now}ms`)),
            );
       }
}