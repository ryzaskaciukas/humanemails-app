var BrowserWindow, app, clipboard, globalShortcut, ipc, main_window, request, robot;

app = require('app');

BrowserWindow = require('browser-window');

ipc = require('ipc');

request = require('request-promise');

globalShortcut = require('global-shortcut');

robot = require('kbm-robot');

clipboard = require('clipboard');

main_window = null;

app.on('ready', function() {
  main_window = new BrowserWindow({
    width: 800,
    height: 600
  });
  main_window.loadUrl('file://' + __dirname + '/index.html');
  return main_window.openDevTools();
});

ipc.on('bind-paste-key', function(e, config) {
  var ret;
  console.log(config);
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
      console.log(resp.sig);
      clipboard.writeText('This program does not support html signature');
      clipboard.writeHtml(resp.sig);
      robot = require("robotjs");
      robot.keyTap('v', 'meta');
      return console.log('PASTED MAC');
    });
  });
  if (ret === false) {
    return console.log('registration failed');
  }
});
