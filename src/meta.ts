import get_tulipx from './tulipx';

export
interface Indicator {
  index: number;
  name: string;
  full_name: string;
  type: number;
  inputs: number;
  options: number;
  outputs: number;
  input_names: string[];
  option_names: string[];
  output_names: string[];
}

export
interface TulipX {
  _push(indic_index: number, size: number, start_task: number): number;
  _pop(): void;
  _inputs(task_index: number, data_index: number): number;
  _options(task_index: number): number;
  _outputs(task_index: number, data_index: number): number;
  _inputs_map(
    task_index: number, input_index: number,
    enabled: number, target_index: number, is_inputs: number, data_index: number,
  ): void;
  _outputs_offset(task_index: number): number;
  _run(task_index: number): void;
  _run_batch(start_index: number, end_index: number): void;
  _erase_batch(start_index: number, end_index: number, only_erase: number): void;
  HEAPF64: Float64Array,
  _set_array(address: number, array: ArrayLike<number>): void;
  _get_array(address: number, size: number): Float64Array;
}

export
async function tulipx_factory() {
  const tulipx: TulipX = await get_tulipx();
  const bytes = tulipx.HEAPF64.BYTES_PER_ELEMENT;
  tulipx._set_array = (address: number, array: ArrayLike<number>) =>
    tulipx.HEAPF64.set(array, address / bytes);
  tulipx._get_array = (address: number, size: number) =>
    tulipx.HEAPF64.subarray(address / bytes, address / bytes + size);
  return tulipx;
}
