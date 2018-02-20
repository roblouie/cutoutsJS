class Controls {
  private analogDeadZone = 0.15;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  start: boolean;
  leftStick = {
    x: 0,
    y: 0
  };

  gamePads: Gamepad[] = [];
  private doesBrowserSupportGamepadEvents: boolean;

  constructor() {
    this.doesBrowserSupportGamepadEvents = 'ongamepadconnected' in window;

    window.addEventListener('keydown', event => {
      switch(event.keyCode)
      {
        case 37: // left arrow
          this.left = true;
          break;
        case 38: // up arrow
          this.up = true;
          break;
        case 39: // right arrow
          this.right = true;
          break;
        case 40: // down arrow
          this.down = true;
          break;
        case 80: // key P pauses the game
          this.start = true;
          break;
      }
    }, false);

    window.addEventListener('keyup', event => {
      switch(event.keyCode)
      {
        case 37: // left arrow
          this.left = false;
          break;
        case 38: // up arrow
          this.up = false;
          break;
        case 39: // right arrow
          this.right = false;
          break;
        case 40: // down arrow
          this.down = false;
          break;
        case 80: // key P pauses the game
          this.start = false;
          break;
      }
    }, false);

    window.addEventListener("gamepadconnected", (event: GamepadEvent) => {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        event.gamepad.index, event.gamepad.id,
        event.gamepad.buttons.length, event.gamepad.axes.length);

      this.gamePads[event.gamepad.index] = event.gamepad;

      console.log(this.gamePads[event.gamepad.index].axes[0]);
    });

    window.addEventListener("gamepaddisconnected", (event: GamepadEvent) => {
      console.log("Gamepad disconnected from index %d: %s",
        event.gamepad.index, event.gamepad.id);

      delete this.gamePads[event.gamepad.index];
    });
  }

  queryControllers() {
    if (!this.doesBrowserSupportGamepadEvents) {
      this.scanForGamePads();
    }

    if (this.gamePads.length) {
      const xAxis = this.gamePads[0].axes[0];
      const yAxis = this.gamePads[0].axes[1];

      this.leftStick.x = Math.abs(xAxis) > this.analogDeadZone ? xAxis : 0;
      this.leftStick.y = Math.abs(yAxis) > this.analogDeadZone ? yAxis : 0;
    }
  }

  scanForGamePads() {
    Array.from(navigator.getGamepads()).forEach((gamePad, index) => {
      this.gamePads[index] = gamePad;
    });
  }
}

export default new Controls();