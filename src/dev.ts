import { TulipX, init, run } from './meta';
import { Global } from './utils';
import { submit, sequence, Task } from './sequence';

async function dev() {
  await init();

  const a = {
    k: 123,
    d: 456,
  };

  type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

  type IsUnion<T, U extends T = T> =
    T extends unknown ? [U] extends [T] ? false : true : false;

  type x = IsUnion<keyof typeof a> extends true ? number : boolean;



  // const tulipx: TulipX = Global.tulipx_wasm;
  
  // const list = Array(100000).fill(0).map(() => Math.random());
  // // const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // let old_time = Date.now();
  // const seq = sequence(() => {
  //   const a = submit(72, [list], [2]);
  //   const b = submit(72, [a.outputs.sma], [3]);
  //   return submit(72, [b.outputs.sma], [3]);
  // });
  // const result = seq.Run();
  // console.log(Date.now() - old_time, result.length);

  // return;
}

dev();
