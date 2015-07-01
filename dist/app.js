var App, Auth, HOST, React, ipc, request;

React = require('react');

ipc = require('ipc');

request = require('request-promise');

HOST = 'http://humanemails.com';

App = React.createClass({
  getInitialState: function() {
    ipc.send('bind-paste-key', {
      user_email: this.props.user_email,
      user_token: this.props.user_token,
      host: HOST
    });
    return {};
  },
  render: function() {
    return React.createElement("div", {
      "className": 'center-align'
    }, React.createElement("nav", null, React.createElement("div", {
      "className": 'nav-wrapper'
    }, "Logged in as ", this.props.user_email)), React.createElement("p", null, "Press CTRL+M in your email app to paste your tracker sig"));
  }
});

Auth = React.createClass({
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
  signIn: function() {
    var data;
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
      "className": 'row'
    }, React.createElement("div", {
      "className": 'input-field'
    }, React.createElement("button", {
      "className": "waves-effect waves-light btn-large",
      "onClick": this.signIn
    }, "Sign in"))));
  }
});

React.render(React.createElement(Auth, null), document.body);
