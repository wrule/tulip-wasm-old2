import { TulipX, init, run } from './meta';
import { Global } from './utils';

async function dev() {
  await init();
  const tulipx: TulipX = Global.tulipx_wasm;
  
  const list = new Float64Array(Array(10000000).fill(0).map(() => Math.random()));
  // const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let old_time = Date.now();
  let result = run(72, [list], [4]);
  console.log(Date.now() - old_time, result.length);
  old_time = Date.now();
  result = run(72, [list], [2]);
  console.log(Date.now() - old_time, result.length);
  old_time = Date.now();
  result = run(72, [list], [2]);
  console.log(Date.now() - old_time, result.length);
  old_time = Date.now();
  result = run(72, [list], [2]);
  console.log(Date.now() - old_time, result.length);
}

dev();
