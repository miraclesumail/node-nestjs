const testa = function(){
        console.log('test1');
}

const testb = function(){
       console.log('test2');
}

const testc = function(){
       console.log('test3');  
}

const fns = [testa, testb, testc].map((fn, index) => {  
    return function(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fn();
                resolve(true);
            }, (index+1)*1000);     
     })
    }
  }
)

async function promiseFn(fns, callback){
      const fn = fns.shift();
      const res = await fn();
      if(!fns.length){
          console.log('alllalal');
          callback();
      }else
          promiseFn(fns, callback);    
}
promiseFn(fns, () => {console.log('finish')});