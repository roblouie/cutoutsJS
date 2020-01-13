import controls from "../core/controls";

export class MenuControls {
  static get Up() {
    return controls.controller.dpad.up || controls.controller.leftStick.y < 0 || controls.keyboard.up;
  };

  static get Down() {
    return controls.controller.dpad.down || controls.controller.leftStick.y > 0 || controls.keyboard.down;
  }

  static get Select() {
    return controls.controller.buttons.bottom || controls.keyboard.space;
  }

  static get GoBack() {
    return controls.controller.buttons.right || controls.keyboard.leftShift;
  }
}
