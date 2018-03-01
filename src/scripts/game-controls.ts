import controls from "../core/controls";

export class GameControls {
  static LeftStick = {
    X: controls.controller.leftStick.x,
  };

  static get Left() {
    return controls.controller.dpad.left || controls.keyboard.left;
  }

  static get Right() {
    return controls.controller.dpad.right || controls.keyboard.right;
  }

  static get Duck() {
    return controls.controller.dpad.down || controls.keyboard.down || controls.controller.leftStick.y < 0;
  }

  static get Jump() {
    return controls.controller.buttons.bottom || controls.keyboard.space;
  }

  static get Sprint() {
    return controls.keyboard.leftShift
      || controls.controller.buttons.left
      || controls.controller.buttons.rightBumper
      || controls.controller.triggers.right > 0;
  }
}
