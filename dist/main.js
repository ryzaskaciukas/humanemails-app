var BrowserWindow, Paster, app, clipboard, globalShortcut, ipc, main_window, paster, request;

app = require('app');

BrowserWindow = require('browser-window');

ipc = require('ipc');

request = require('request-promise');

globalShortcut = require('global-shortcut');

clipboard = require('clipboard');

main_window = null;

app.on('ready', function() {
  main_window = new BrowserWindow({
    width: 300,
    height: 400
  });
  return main_window.loadUrl('file://' + __dirname + '/index.html');
});

Paster = require('./paster');

paster = new Paster();

ipc.on('bind-paste-key', function(e, config) {
  var ret;
  ret = globalShortcut.register('Ctrl+M', function() {
    var data;
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
      clipboard.writeHtml(resp.sig);
      return paster.paste();
    });
  });
  if (ret === false) {
    return console.log('registration failed');
  }
});
