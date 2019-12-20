import controls from "../core/controls";

export class MenuControls {
  static get Up() {
    return controls.controller.dpad.up || controls.controller.leftStick.y < 0 || controls.keyboard.up;
  };

  static get Down() {
    return controls.controller.dpad.down || controls.controller.leftStick.y > 0 || controls.keyboard.down;
  }

  static get Select() {
    return controls.controller.dpad.right || controls.controller.leftStick.x > 0 || controls.keyboard.right;
  }

  static get GoBack() {
    return controls.controller.dpad.left || controls.controller.leftStick.x < 0 || controls.keyboard.left;
  }
}
