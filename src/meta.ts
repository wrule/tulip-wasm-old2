
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
    task_index: number, input_index: number, enabled: number,
    target_index: number, is_inputs: number, data_index: number,
  ): void;
  _outputs_offset(task_index: number): number;
  _run(task_index: number): void;
  _run_batch(start_index: number, end_index: number): void;
  _erase_batch(start_index: number, end_index: number): void;
}
