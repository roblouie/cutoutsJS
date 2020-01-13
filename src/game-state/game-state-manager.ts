import {MainMenuState} from "./main-menu.state";
import {StateMachine} from "../core/state-machine/state-machine";
import {InGameState} from "./in-game.state";

class GameStateManager {
  private gameStateMachine = new StateMachine();

  static States = {
    MainMenu: 'MainMenu',
    InGame: 'InGame',
  };

  constructor() {
    this.gameStateMachine.add(GameStateManager.States.MainMenu, new MainMenuState());
    this.gameStateMachine.add(GameStateManager.States.InGame, new InGameState());
    this.gameStateMachine.change(GameStateManager.States.MainMenu);
  }

  goInGame() {
    this.gameStateMachine.change(GameStateManager.States.InGame);
  }

  goToMenu() {
    this.gameStateMachine.change(GameStateManager.States.MainMenu);
  }

  update() {
    this.gameStateMachine.update();
  }

  draw() {
    this.gameStateMachine.draw();
  }

  handleInput() {
    this.gameStateMachine.handleInput();
  }
}

export const gameStateManager = new GameStateManager();
