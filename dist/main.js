var BrowserWindow, Paster, alert, app, clipboard, globalShortcut, ipc, main_window, paster, request;

app = require('app');

BrowserWindow = require('browser-window');

ipc = require('ipc');

request = require('request-promise');

globalShortcut = require('global-shortcut');

clipboard = require('clipboard');

main_window = null;

app.on('ready', function() {
  main_window = new BrowserWindow({
    width: 800,
    height: 700
  });
  main_window.loadUrl('file://' + __dirname + '/index.html');
  return main_window.openDevTools();
});

alert = function(what) {
  return main_window.webContents.send('alert', what);
};

Paster = require('./paster');

paster = new Paster(alert);

ipc.on('bind-paste-key', function(e, config) {
  var ret;
  ret = globalShortcut.register('Ctrl+M', function() {
    var data;
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
      try {
        main_window.setProgressBar(0.5);
        clipboard.writeHtml(resp.sig);
        return paster.paste().then(function() {
          main_window.setProgressBar(1);
          return setTimeout((function() {
            return main_window.setProgressBar(-1);
          }), 1000);
        });
      } catch (_error) {
        e = _error;
        return alert(e.message + e.stack);
      }
    });
  });
  if (ret === false) {
    return alert('registration failed');
  }
});
