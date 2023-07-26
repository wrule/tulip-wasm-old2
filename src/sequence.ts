import indicators from './indicators.json';
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
  inputs_data: Input[],
  options_data: ArrayLike<number>,
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

  public Push(task: Task) {
    if (this.size == null)
      this.size =
        (task.inputs_data.find((input) => is_arraylike(input)) as ArrayLike<number>)?.length;
    this.tasks.push(task);
  }
}

export
function sequence(func: () => void) {
  const seq = new Sequence();
  Global.tulipx_sequence = seq;
  func();
  Global.tulipx_sequence = null;
}

export
function submit(
  indic_index: number,
  inputs: Input[],
  options: ArrayLike<number>,
) {
  const seq: Sequence = Global.tulipx_sequence;
  const indic = indicators[indic_index];
  const task: Task = {
    id: 0,
    indic_index, inputs_data: inputs, options_data: options,
    inputs: Object.fromEntries(indic.input_names.map((name, index) => ([name, {
      target_index: task, is_inputs: 1, data_index: index,
    } as InputMap]))),
  };
}
