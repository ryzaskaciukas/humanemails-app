var Paster, os, robot;

os = require('os');

robot = require('robotjs');

module.exports = Paster = (function() {
  function Paster(alert) {
    this.alert = alert;
    this.platform = os.platform();
  }

  Paster.prototype.paste = function() {
    if (this.platform === 'darwin') {
      return this.pasteMac();
    } else if (/^win/.test(this.platform)) {
      return this.pasteWindows();
    } else {
      return new Error("Platform " + this.platform + " not supported");
    }
  };

  Paster.prototype.pasteMac = function() {
    return robot.keyTap('v', 'command');
  };

  Paster.prototype.pasteWindows = function() {
    return robot.sleep(500).press('CTRL').press('v').sleep(500).release('v').release('CTRL').go();
  };

  return Paster;

})();
