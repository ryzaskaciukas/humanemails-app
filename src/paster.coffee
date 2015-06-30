os = require('os')
robot = require('kbm-robot')

module.exports =
class Paster
  constructor: (@alert) ->
    @platform = os.platform()
    robot.startJar()

  paste: ->
    if @platform == 'darwin'
      @pasteMac()
    else if /^win/.test(@platform)
      @pasteWindows()
    else
      new Error("Platform #{@platform} not supported")

  pasteMac: ->
    robot
      .sleep(500)
      .press('META')
      .press('v')
      .sleep(100)
      .release('META')
      .release('v')
      .go()

  pasteWindows: ->
    robot
      .sleep(500)
      .press('CTRL')
      .press('v')
      .sleep(500)
      .release('v')
      .release('CTRL')
      .go()
