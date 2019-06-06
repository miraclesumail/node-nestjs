import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var schedule = require('node-schedule');

/**
 *  3s执行一次
 *  cancelNext 取消下一次执行
 */

let count = 0;

var j = schedule.scheduleJob('*/3 * * * * *', function(fireDate){
    count++;
    if(count > 0 && !(count%3))
        j.cancelNext();
    console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
    console.log(j.nextInvocation());
});

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3006 });
console.log('websocket gegrwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');

function createFiveNums() {
     let arr = [];
     while(arr.length < 5) {
          arr.push(Math.random()*10 | 0)
     }
     return arr;
}

wss.on('connection', function connection(ws) {
  console.log('websocket geg');
  ws.on('message', function incoming(message) {
     console.log('received: %s', message);
     if(JSON.parse(message).type == 'newDate'){
          setTimeout(() => {
              ws.send(JSON.stringify({type: 'newDate', nums: createFiveNums(), id: 113}))
          }, 2000);    
     }
  });
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
