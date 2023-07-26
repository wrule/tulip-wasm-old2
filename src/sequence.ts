
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
  inputs: { [name: string]: InputMap },
  outputs: { [name: string]: InputMap },
}

function is_arraylike(input: Input) {
  return (input as ArrayLike<number>).length != null;
}
