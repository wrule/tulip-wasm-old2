import tulipx from './tulipx';

async function dev() {
  const t = await tulipx();
  const list = Array(10000000).fill(0).map(() => Math.random());
  // const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const old_time = Date.now();
  const task = t._push(72, list.length, 0);
  const input_index = t._inputs(task, 0) / 8;
  t.HEAPF64.set(list, input_index);
  t.HEAPF64.set([2], t._options() / 8);
  t._run(task);
  const output_index = t._outputs(task, 0) / 8;
  const result = t.HEAPF64.slice(output_index, output_index + list.length);
  console.log(Date.now() - old_time);
  console.log(result.length);
}

dev();
