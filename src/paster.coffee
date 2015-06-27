os = require('os')

module.exports =
class Paster
  constructor: ->
    @platform = os.platform()

  paste: ->
    if @platform == 'darwin'
      @pasteMac()
    else if /^win/.match(@platform)
      @pasteWindows()
    else
      new Error("Platform #{@platform} not supported")

  pasteMac: ->
    robot = require("robotjs")
    robot.keyTap('v', 'meta')

  pasteWindows: ->
    keyboard = require('node_keyboard')
    keyboard.press(Key_Control_L)
    keyboard.press(Key_V)
    keyboard.release(Key_V)
    keyboard.release(Key_Control_L)
