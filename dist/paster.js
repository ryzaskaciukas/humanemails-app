var Paster, os;

os = require('os');

module.exports = Paster = (function() {
  function Paster() {
    this.platform = os.platform();
  }

  Paster.prototype.paste = function() {
    if (this.platform === 'darwin') {
      return this.pasteMac();
    } else if (/^win/.match(this.platform)) {
      return this.pasteWindows();
    } else {
      return new Error("Platform " + this.platform + " not supported");
    }
  };

  Paster.prototype.pasteMac = function() {
    var robot;
    robot = require("robotjs");
    return robot.keyTap('v', 'meta');
  };

  Paster.prototype.pasteWindows = function() {
    var keyboard;
    keyboard = require('node_keyboard');
    keyboard.press(Key_Control_L);
    keyboard.press(Key_V);
    keyboard.release(Key_V);
    return keyboard.release(Key_Control_L);
  };

  return Paster;

})();
