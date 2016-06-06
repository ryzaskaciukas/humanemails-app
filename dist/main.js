var BrowserWindow, Paster, _, alert, app, clipboard, globalShortcut, ipcMain, main_window, paster, request;

app = require('electron').app;

BrowserWindow = require('electron').BrowserWindow;

ipcMain = require('electron').ipcMain;

request = require('request-promise');

_ = require('lodash');

globalShortcut = require('electron').globalShortcut;

clipboard = require('electron').clipboard;

main_window = null;

app.on('ready', function() {
  main_window = new BrowserWindow({
    width: 300,
    height: 400
  });
  return main_window.loadURL('file://' + __dirname + '/index.html');
});

alert = function(what) {
  return main_window.webContents.send('alert', what);
};

Paster = require('./paster');

paster = new Paster(alert);

ipcMain.on('bind-paste-key', function(e, config) {
  var executeSigPaste;
  executeSigPaste = function() {
    var availableFormats, clipboardBackup, data;
    availableFormats = [
      {
        key: 'text',
        write: 'writeText',
        read: 'readText'
      }, {
        key: 'html',
        write: 'writeHTML',
        read: 'readHTML'
      }, {
        key: 'rtf',
        write: 'writeRTF',
        read: 'readRTF'
      }, {
        key: 'image',
        write: 'writeImage',
        read: 'readImage'
      }
    ];
    clipboardBackup = {};
    _.each(availableFormats, function(format) {
      return clipboardBackup[format.key] = clipboard[format.read]();
    });
    main_window.setProgressBar(0);
    data = {
      user_email: config.user_email,
      user_token: config.user_token,
      host: config.host
    };
    return request({
      uri: config.host + "/app/use",
      method: 'POST',
      body: data,
      json: true
    }).then(function(resp) {
      var error;
      try {
        main_window.setProgressBar(0.5);
        clipboard.writeHtml(resp.sig);
        paster.paste();
        main_window.setProgressBar(1);
        return setTimeout((function() {
          return main_window.setProgressBar(-1);
        }), 1000);
      } catch (error) {
        e = error;
        return alert(e.message + e.stack);
      } finally {
        _.each(availableFormats, function(format) {
          return clipboard[format.write](clipboardBackup[format.key]);
        });
      }
    });
  };
  return globalShortcut.register('CmdOrCtrl+M', executeSigPaste);
});
