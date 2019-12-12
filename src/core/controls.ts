class Controls {
  private analogDeadZone = 0.15;
  keyboard = {
    up: false,
    down: false,
    left: false,
    right: false,
    leftControl: false,
    leftShift: false,
    space: false,
    p: false
  };

  controller = {
    leftStick: {
      x: 0,
      y: 0
    },
    dpad: {
      up: false,
      down: false,
      left: false,
      right: false
    },
    buttons: {
      top: false,
      right: false,
      bottom: false,
      left: false,
      leftBumper: false,
      rightBumper: false,
      start: false
    },
    triggers: {
      left: 0,
      right: 0
    }
  };


  gamePads: Gamepad[] = [];
  private doesBrowserSupportGamepadEvents: boolean;

  constructor() {
    this.doesBrowserSupportGamepadEvents = 'ongamepadconnected' in window;

    window.addEventListener('keydown', event => {
      switch(event.keyCode)
      {
        case 37: // left arrow
          this.keyboard.left = true;
          break;
        case 38: // up arrow
          this.keyboard.up = true;
          break;
        case 39: // right arrow
          this.keyboard.right = true;
          break;
        case 40: // down arrow
          this.keyboard.down = true;
          break;
        case 80: // key P pauses the game
          this.keyboard.p = true;
          break;
        case 16: // shift key
          this.keyboard.leftShift = true;
          break;
        case 32:
          this.keyboard.space = true;
          break;
      }
    }, false);

    window.addEventListener('keyup', event => {
      switch(event.keyCode)
      {
        case 37: // left arrow
          this.keyboard.left = false;
          break;
        case 38: // up arrow
          this.keyboard.up = false;
          break;
        case 39: // right arrow
          this.keyboard.right = false;
          break;
        case 40: // down arrow
          this.keyboard.down = false;
          break;
        case 80: // key P pauses the game
          this.keyboard.p = false;
          break;
        case 16: // shift key
          this.keyboard.leftShift = false;
          break;
        case 32:
          this.keyboard.space = false;
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

    if (this.gamePads[0] !== null) { // if there is at least one gamepad
      const xAxis = this.gamePads[0].axes[0];
      const yAxis = this.gamePads[0].axes[1];
      const rightTrigger = this.gamePads[0].buttons[7].value;
      const leftTrigger = this.gamePads[0].buttons[6].value;

      this.controller.leftStick.x = Math.abs(xAxis) > this.analogDeadZone ? xAxis : 0;
      this.controller.leftStick.y = Math.abs(yAxis) > this.analogDeadZone ? yAxis : 0;
      this.controller.buttons.bottom = this.gamePads[0].buttons[0].pressed;
      this.controller.buttons.right = this.gamePads[0].buttons[1].pressed;
      this.controller.buttons.left = this.gamePads[0].buttons[2].pressed;
      this.controller.buttons.top = this.gamePads[0].buttons[3].pressed;
      this.controller.buttons.leftBumper = this.gamePads[0].buttons[4].pressed;
      this.controller.buttons.rightBumper = this.gamePads[0].buttons[5].pressed;
      this.controller.buttons.start = this.gamePads[0].buttons[9].pressed;
      this.controller.triggers.left = Math.abs(leftTrigger) > this.analogDeadZone ? leftTrigger : 0;
      this.controller.triggers.right = Math.abs(rightTrigger) > this.analogDeadZone ? rightTrigger : 0;
    }
  }

  scanForGamePads() {
    Array.from(navigator.getGamepads()).forEach((gamePad, index) => {
      this.gamePads[index] = gamePad;
    });
  }
}

export default new Controls();