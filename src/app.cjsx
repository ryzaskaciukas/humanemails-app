React = require('react')
ipc = require('ipc')
request = require('request-promise')

HOST = 'http://app.humanemails.com'

App = React.createClass
  getInitialState: ->
    ipc.send('bind-paste-key', user_email: @props.user_email, user_token: @props.user_token, host: HOST)

    {}
  render: ->
    <div className='center-align'>
      <nav>
        <div className='nav-wrapper'>
          Logged in as {@props.user_email}
        </div>
      </nav>
      <p>Press CTRL+M in your email app to paste your tracker sig</p>
    </div>

Auth = React.createClass
  getInitialState: ->
    {}
  changeEmail: (e) ->
    @setState(email: e.target.value)
  changePassword: (e) ->
    @setState(password: e.target.value)
  signIn: ->
    data =
      user:
        email: @state.email
        password: @state.password

    request(uri: "#{HOST}/users/sign_in", method: 'POST', body: data, json: true).then((resp) ->
      React.render(<App user_email={data.user.email} user_token={resp.authentication_token} />, document.body)
    ).catch ->
      alert('Wrong email or password')

  render: ->
    <div className='container'>
      <div className='row'>
        <div className='input-field'>
          <input placeholder='Email' type='text' value={@state.email} onChange={@changeEmail}/>
        </div>
      </div>

      <div className='row'>
        <div className='input-field'>
          <input placeholder='Password' type='password' value={@state.password} onChange={@changePassword}/>
        </div>
      </div>

      <div className='row'>
        <div className='input-field'>
          <button className="waves-effect waves-light btn-large" onClick={@signIn}>Sign in</button>
        </div>
      </div>
    </div>

React.render(<Auth/>, document.body)
