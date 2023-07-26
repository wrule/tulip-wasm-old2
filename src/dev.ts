import { TulipX, init, run, submit,sequence } from './meta';
import { Global } from './utils';

async function dev() {
  await init();
  const tulipx: TulipX = Global.tulipx_wasm;
  
  // const list = Array(10000000).fill(0).map(() => Math.random());
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const a = sequence(() => {
    const a = submit(72, [list], [2]);
    console.log(a);
    const b = submit(72, [a.outputs.sma], [3]);
    console.log(b);
  });
  console.log(a);

  return;
  // const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let old_time = Date.now();
  let result = run(72, [list], [2]);
  console.log(Date.now() - old_time, result[0].length);
  old_time = Date.now();
  result = run(72, [list], [2]);
  console.log(Date.now() - old_time, result[0].length);
  old_time = Date.now();
  result = run(72, [list], [2]);
  console.log(Date.now() - old_time, result[0].length);
  old_time = Date.now();
  result = run(72, [list], [2]);
  console.log(Date.now() - old_time, result[0].length);
}

dev();
