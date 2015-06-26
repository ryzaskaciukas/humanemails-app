app = require('app')
BrowserWindow = require('browser-window')
ipc = require('ipc')
request = require('request-promise')

globalShortcut = require('global-shortcut')
robot = require('kbm-robot')
clipboard = require('clipboard')

main_window = null

app.on 'ready', ->

  main_window = new BrowserWindow({width: 800, height: 600})
  main_window.loadUrl('file://' + __dirname + '/index.html')
  main_window.openDevTools()

ipc.on 'bind-paste-key', (e, config) ->
  console.log(config)
  robot.startJar()

  ret = globalShortcut.register 'Ctrl+M', ->
    data =
      user_email: config.user_email
      user_token: config.user_token
      host: config.host

    request(uri: "#{config.host}/app/use", method: 'POST', body: data, json: true).then (resp) ->
      console.log(resp.sig)
      clipboard.writeText('This program does not support html signature')
      clipboard.writeHtml(resp.sig)

      robot.sleep(500).press('META').press('v').sleep(100).release('META').release('v').go().then ->
        console.log 'PASTED'

  if ret == false
    console.log 'registration failed'
