import indicators from './indicators.json';

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
  inputs_data: (ArrayLike<number> | InputMap)[],
  options_data: ArrayLike<number>,
  inputs: { [name: string]: InputMap },
  outputs: { [name: string]: InputMap },
}

function is_arraylike(input: Input) {
  return (input as ArrayLike<number>).length != null;
}

export
class Sequence {
  private tasks: Task[] = [];

  public get Size() {
    return 0;
  }

  public get Outputs() {
    return indicators[this.tasks[this.tasks.length - 1].indic_index].outputs;
  }

  public Push(task: Task) {
    this.tasks.push(task);
  }
}
