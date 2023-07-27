import { TulipX, init, run } from './meta';
import { Global } from './utils';
import { submit, sequence, Task } from './sequence';

type IsUnion<T, U extends T = T> =
  T extends unknown ? [U] extends [T] ? false : true : false;

async function dev() {
  await init();

  const a = {
    id: 0, indic_index: 0,
    inputs: {
      real1: { target_index: 0, is_inputs: 1, data_index: 0 },
      real2: { target_index: 0, is_inputs: 1, data_index: 1 },
      real3: { target_index: 0, is_inputs: 1, data_index: 2 },
    },
    outputs: {
      k: { target_index: 0, is_inputs: 0, data_index: 0 },
      d: { target_index: 0, is_inputs: 0, data_index: 0 },
    },
  };

  type TaskResult<T extends Task> = IsUnion<keyof T['outputs']> extends true ?
    { [key in keyof T['outputs']]: Float64Array } :
    Float64Array;

  let c: TaskResult<typeof a>;


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
