app = require('app')
BrowserWindow = require('browser-window')
ipc = require('ipc')
request = require('request-promise')

globalShortcut = require('global-shortcut')
clipboard = require('clipboard')

main_window = null

app.on 'ready', ->
  main_window = new BrowserWindow(width: 300, height: 400)
  main_window.loadUrl('file://' + __dirname + '/index.html')

Paster = require('./paster')
paster = new Paster()

ipc.on 'bind-paste-key', (e, config) ->
  ret = globalShortcut.register 'Ctrl+M', ->
    data =
      user_email: config.user_email
      user_token: config.user_token
      host: config.host

    request(uri: "#{config.host}/app/use", method: 'POST', body: data, json: true).then (resp) ->
      clipboard.writeHtml(resp.sig)

      paster.paste()


  if ret == false
    console.log 'registration failed'
