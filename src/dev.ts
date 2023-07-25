import { TulipX, init } from './meta';
import { Global } from './utils';

async function dev() {
  await init();
  const tulipx: TulipX = Global.tulipx_wasm;
  
  const list = Array(10000000).fill(0).map(() => Math.random());
  // const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const old_time = Date.now();
  const task = tulipx._push(72, list.length, 0);
  tulipx._set_array(tulipx._inputs(task, 0), list);
  tulipx._set_array(tulipx._options(task), [2]);
  tulipx._run(task);
  const result = tulipx._get_array(tulipx._outputs(task, 0), list.length);
  tulipx._pop();
  console.log(Date.now() - old_time, result.length);
}

dev();
