app = require('electron').app
BrowserWindow = require('electron').BrowserWindow
ipcMain = require('electron').ipcMain
request = require('request-promise')
_ = require 'lodash'

globalShortcut = require('electron').globalShortcut
clipboard = require('electron').clipboard

main_window = null

app.on 'ready', ->
  main_window = new BrowserWindow(width: 300, height: 400)
  main_window.loadURL('file://' + __dirname + '/index.html')
  # main_window.openDevTools()

alert = (what) ->
  main_window.webContents.send('alert', what)

Paster = require('./paster')
paster = new Paster(alert)

ipcMain.on 'bind-paste-key', (e, config) ->
  executeSigPaste = ->
    availableFormats = [
      {
        key: 'text'
        write: 'writeText'
        read: 'readText'
      }
      {
        key: 'html'
        write: 'writeHTML'
        read: 'readHTML'
      }
      {
        key: 'rtf'
        write: 'writeRTF'
        read: 'readRTF'
      }
      {
        key: 'image'
        write: 'writeImage'
        read: 'readImage'
      }
    ]

    clipboardBackup = {}

    _.each availableFormats, (format) ->
      clipboardBackup[format.key] = clipboard[format.read]()

    # alert(clipboardBackup)

    # formats = _.map clipboard.availableFormats(), (format) ->
    #   format.split('/')[0]

    # alert(_.uniq(formats))
    # alert(clipboard.read())
    # _.each clipboard.availableFormats(), (format) ->
    #   alert(format)
      # clipboardBackup[format] =

    main_window.setProgressBar(0)
    data =
      user_email: config.user_email
      user_token: config.user_token
      host: config.host

    request(uri: "#{config.host}/app/use", method: 'POST', body: data, json: true).then (resp) ->
      try
        main_window.setProgressBar(0.5)
        clipboard.writeHtml(resp.sig)

        paster.paste()
        main_window.setProgressBar(1)
        setTimeout((-> main_window.setProgressBar(-1)), 1000)
      catch e
        alert(e.message + e.stack)
      finally
        _.each availableFormats, (format) ->
          clipboard[format.write](clipboardBackup[format.key])

  globalShortcut.register('CmdOrCtrl+M', executeSigPaste)
