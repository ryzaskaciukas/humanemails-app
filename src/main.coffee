app = require('app')
BrowserWindow = require('browser-window')
ipc = require('ipc')
request = require('request-promise')

globalShortcut = require('global-shortcut')
clipboard = require('clipboard')

main_window = null

app.on 'ready', ->
  main_window = new BrowserWindow(width: 800, height: 700)
  main_window.loadUrl('file://' + __dirname + '/index.html')
  main_window.openDevTools()

alert = (what) ->
  main_window.webContents.send('alert', what)

Paster = require('./paster')
paster = new Paster(alert)

ipc.on 'bind-paste-key', (e, config) ->
  ret = globalShortcut.register 'Ctrl+M', ->
    main_window.setProgressBar(0)
    data =
      user_email: config.user_email
      user_token: config.user_token
      host: config.host

    request(uri: "#{config.host}/app/use", method: 'POST', body: data, json: true).then (resp) ->
      try
        main_window.setProgressBar(0.5)
        clipboard.writeHtml(resp.sig)

        paster.paste().then ->
          main_window.setProgressBar(1)
          setTimeout((-> main_window.setProgressBar(-1)), 1000)
      catch e
        alert(e.message + e.stack)

  if ret == false
    alert('registration failed')
