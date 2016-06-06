os = require('os')
robot = require('robotjs')

module.exports =
class Paster
  constructor: (@alert) ->
    @platform = os.platform()

  paste: ->
    if @platform == 'darwin'
      @pasteMac()
    else if /^win/.test(@platform)
      @pasteWindows()
    else
      new Error("Platform #{@platform} not supported")

  pasteMac: ->
    robot.keyTap('v', 'command')

  pasteWindows: ->
    robot
      .sleep(500)
      .press('CTRL')
      .press('v')
      .sleep(500)
      .release('v')
      .release('CTRL')
      .go()
