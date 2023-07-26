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

  public get Size() {
    if (this.size == null) throw '';
    return this.size;
  }

  public get Outputs() {
    return indicators[this.tasks[this.tasks.length - 1].indic_index].outputs;
  }

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
      inputs: this.inputs_map(indic.input_names, id, 1),
      outputs: this.inputs_map(indic.output_names, id, 0),
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
