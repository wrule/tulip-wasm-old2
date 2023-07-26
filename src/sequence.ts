import indicators from './indicators.json';
import { TulipX } from './meta';
import { Global } from './utils';

export
interface InputMap {
  target_index: number;
  is_inputs: number;
  data_index: number;
}

export
type Input = ArrayLike<number> | InputMap;

export
interface Task {
  id: number;
  indic_index: number;
  inputs: { [name: string]: InputMap },
  outputs: { [name: string]: InputMap },
}

function is_arraylike(input: Input) {
  return (input as ArrayLike<number>).length != null;
}

export
class Sequence {
  private size?: number;
  private tasks: Task[] = [];

  public get Size() {
    if (this.size == null) throw '';
    return this.size;
  }

  public get Outputs() {
    return indicators[this.tasks[this.tasks.length - 1].indic_index].outputs;
  }

  public Push(
    indic_index: number,
    inputs: Input[],
    options: ArrayLike<number>,
  ) {
    if (this.size == null)
      this.size =
        (inputs.find((input) => is_arraylike(input)) as ArrayLike<number>)?.length;
    const tulipx: TulipX = Global.tulipx_wasm;
    const id = tulipx._push(indic_index, this.Size, 0);
    inputs.forEach((input, index) => {
      if (is_arraylike(input))
        tulipx._set_array(tulipx._inputs(id, index), input as ArrayLike<number>);
      else {
        const map = input as InputMap;
        tulipx._inputs_map(id, index, 1, map.target_index, map.is_inputs, map.data_index);
      }
    });
    tulipx._set_array(tulipx._options(id), options);
    const indic = indicators[indic_index];
    const task: Task = {
      id, indic_index,
      inputs: Object.fromEntries(indic.input_names.map((name, index) => ([name, {
        target_index: id, is_inputs: 1, data_index: index,
      }]))),
      outputs: Object.fromEntries(indic.output_names.map((name, index) => ([name, {
        target_index: id, is_inputs: 0, data_index: index,
      }]))),
    };
    this.tasks.push(task);
    return task;
  }
}

export
function sequence(func: () => void) {
  const seq = new Sequence();
  Global.tulipx_sequence = seq;
  func();
  Global.tulipx_sequence = null;
}
