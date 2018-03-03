import {State} from './state';

export class StateMachine {
  private stateMap: Map<string, State> = new Map<string, State>();
  private currentState: State = new State();

  add(id: string, state: State) {
    this.stateMap.set(id, state);
  }

  remove(id: string) {
    this.stateMap.delete(id);
  }

  clear() {
    this.stateMap.clear();
    this.change('1');
  }

  change(id: string, ...argsForStateEnter: any[]) {
    this.currentState.exit();
    const next: State = this.stateMap.get(id);
    next.enter(...argsForStateEnter);
    this.currentState = next;
  }

  update() {
    this.currentState.update();
  }

  handleInput() {
    this.currentState.handleInput();
  }
}
