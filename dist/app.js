var App, Auth, HOST, React, ipcRenderer, request;

React = require('react');

ipcRenderer = require('electron').ipcRenderer;

request = require('request-promise');

HOST = 'http://app.humanemails.com';

App = React.createClass({displayName: "App",
  getInitialState: function() {
    ipcRenderer.send('bind-paste-key', {
      user_email: this.props.user_email,
      user_token: this.props.user_token,
      host: HOST
    });
    return {};
  },
  render: function() {
    return React.createElement("div", {
      "className": 'container center-align instructions'
    }, React.createElement("div", {
      "className": 'row press'
    }, "Press"), React.createElement("div", {
      "className": 'row big-line'
    }, React.createElement("span", {
      "className": 'cmd'
    }, "⌘"), " + M"), React.createElement("div", {
      "className": 'row no-padding'
    }, "in your email"), React.createElement("div", {
      "className": 'row'
    }, React.createElement("b", null, "to track it")), React.createElement("div", {
      "className": 'row bottom-logo'
    }, React.createElement("img", {
      "src": 'img/bottom.png',
      "height": 25
    })));
  }
});

Auth = React.createClass({displayName: "Auth",
  getInitialState: function() {
    return {};
  },
  changeEmail: function(e) {
    return this.setState({
      email: e.target.value
    });
  },
  changePassword: function(e) {
    return this.setState({
      password: e.target.value
    });
  },
  signIn: function(e) {
    var data;
    e.preventDefault();
    data = {
      user: {
        email: this.state.email,
        password: this.state.password
      }
    };
    return request({
      uri: HOST + "/users/sign_in",
      method: 'POST',
      body: data,
      json: true
    }).then(function(resp) {
      return React.render(React.createElement(App, {
        "user_email": data.user.email,
        "user_token": resp.authentication_token
      }), document.body);
    })["catch"](function() {
      return alert('Wrong email or password');
    });
  },
  render: function() {
    return React.createElement("div", {
      "className": 'container'
    }, React.createElement("div", {
      "className": 'logo row'
    }, React.createElement("div", {
      "className": 'col s8'
    }, React.createElement("img", {
      "className": 'responsive-img',
      "src": 'img/logo.png'
    }))), React.createElement("form", {
      "onSubmit": this.signIn
    }, React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("input", {
      "placeholder": 'Email',
      "type": 'text',
      "value": this.state.email,
      "onChange": this.changeEmail
    }))), React.createElement("div", {
      "className": 'row'
    }, React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("input", {
      "placeholder": 'Password',
      "type": 'password',
      "value": this.state.password,
      "onChange": this.changePassword
    }))), React.createElement("div", {
      "className": 'row center-align'
    }, React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("button", {
      "className": "waves-effect waves-light btn-large"
    }, "Sign in")))));
  }
});

React.render(React.createElement(Auth, null), document.body);
