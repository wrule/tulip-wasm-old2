import { TulipX } from './meta';
import { Global } from './utils';
import indicators from './indicators.json';

export
interface InputMap {
  target_index: number;
  is_inputs: number;
  data_index: number;
}

export
interface InputsMap {
  [name: string]: InputMap;
}

export
type Input = ArrayLike<number> | InputMap;

export
interface Task {
  id: number;
  indic_index: number;
  inputs: InputsMap,
  outputs: InputsMap,
}

export
type IsUnion<T, U extends T = T> =
  T extends unknown ? [U] extends [T] ? false : true : false;

export
type Result<T extends InputsMap> = IsUnion<keyof T> extends true ?
  { [key in keyof T]: Float64Array } :
  Float64Array;

function is_arraylike(input: Input) {
  return (input as ArrayLike<number>).length != null;
}

export
class Sequence<T extends Task> {
  private size!: number;
  private tasks: Task[] = [];
  private readonly tulipx: TulipX = Global.tulipx_wasm;

  private inputs_map(
    names: string[],
    target_index: number,
    is_inputs: number,
  ): InputsMap {
    return Object.fromEntries(names.map((name, index) => [name, {
      target_index, is_inputs, data_index: index,
    }]));
  }

  public Push(
    indic_index: number,
    inputs: Input[],
    options: ArrayLike<number>,
  ) {
    if (this.size == null)
      this.size =
        (inputs.find((input) => is_arraylike(input)) as ArrayLike<number>)?.length;
    if (this.size == null) throw 'size';
    const id = this.tulipx._push(indic_index, this.size, 0);
    inputs.forEach((input, index) => {
      if (is_arraylike(input))
        this.tulipx._set_array(this.tulipx._inputs(id, index), input as ArrayLike<number>);
      else {
        const map = input as InputMap;
        this.tulipx._inputs_map(id, index, 1, map.target_index, map.is_inputs, map.data_index);
      }
    });
    this.tulipx._set_array(this.tulipx._options(id), options);
    const task: Task = {
      id, indic_index,
      inputs: this.inputs_map(indicators[indic_index].input_names, id, 1),
      outputs: this.inputs_map(indicators[indic_index].output_names, id, 0),
    };
    this.tasks.push(task);
    return task;
  }

  public Run() {
    if (this.tasks.length < 1) throw 'tasks';
    const first = this.tasks[0];
    const last = this.tasks[this.tasks.length - 1];
    this.tulipx._run_batch(first.id, last.id);
    const indic = indicators[last.indic_index];
    const outputs_size = indic.outputs;
    const outputs = Array(outputs_size).fill(0)
      .map((_, index) => this.tulipx._get_array(
        this.tulipx._outputs(last.id, index),
        this.size,
      ));
    const outputs_offset = this.tulipx._outputs_offset(last.id);
    outputs.forEach((output) => output.fill(NaN, 0, outputs_offset));
    if (outputs.length < 2) return outputs[0] as TaskResult<T>;
    return Object.fromEntries(
      indic.output_names.map((name, index) => [name, outputs[index]])
    ) as TaskResult<T>;
  }

  public RunOnce() {
    const result = this.Run();
    const first = this.tasks[0];
    const last = this.tasks[this.tasks.length - 1];
    this.tulipx._erase_batch(first.id, last.id, 0);
    return result;
  }
}

export
function submit(
  indic_index: number,
  inputs: Input[],
  options: ArrayLike<number>,
) {
  const seq: Sequence<Task> = Global.tulipx_sequence;
  return seq.Push(indic_index, inputs, options);
}

export
function sequence<T extends Task>(func: () => T) {
  const seq = new Sequence<T>();
  Global.tulipx_sequence = seq;
  func();
  Global.tulipx_sequence = null;
  return seq;
}
