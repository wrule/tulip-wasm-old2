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

function is_arraylike(input: Input) {
  return (input as ArrayLike<number>).length != null;
}

export
class Sequence {
  private size?: number;
  private tasks: Task[] = [];

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
    const tulipx: TulipX = Global.tulipx_wasm;
    const id = tulipx._push(indic_index, this.size, 0);
    inputs.forEach((input, index) => {
      if (is_arraylike(input))
        tulipx._set_array(tulipx._inputs(id, index), input as ArrayLike<number>);
      else {
        const map = input as InputMap;
        tulipx._inputs_map(id, index, 1, map.target_index, map.is_inputs, map.data_index);
      }
    });
    tulipx._set_array(tulipx._options(id), options);
    const task: Task = {
      id, indic_index,
      inputs: this.inputs_map(indicators[indic_index].input_names, id, 1),
      outputs: this.inputs_map(indicators[indic_index].output_names, id, 0),
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
