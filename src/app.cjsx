React = require('react')
ipc = require('ipc')
request = require('request-promise')

HOST = 'http://app.humanemails.com'

App = React.createClass
  getInitialState: ->
    ipc.send('bind-paste-key', user_email: @props.user_email, user_token: @props.user_token, host: HOST)

    {}
  render: ->
    <div className='container center-align instructions'>
      <div className='row press'>
        Press
      </div>
      <div className='row big-line'>
        <span className='cmd'>⌘</span> + M
      </div>
      <div className='row no-padding'>
        in your email
      </div>
      <div className='row'>
        <b>to track it</b>
      </div>
      <div className='row bottom-logo'>
        <img src='img/bottom.png' height=25 />
      </div>
    </div>

Auth = React.createClass
  getInitialState: ->
    {}
  changeEmail: (e) ->
    @setState(email: e.target.value)
  changePassword: (e) ->
    @setState(password: e.target.value)
  signIn: (e) ->
    e.preventDefault()

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
      <div className='logo row'>
        <div className='col s8'>
          <img className='responsive-img' src='img/logo.png' />
        </div>
      </div>

      <form onSubmit={@signIn}>
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

        <div className='row center-align'>
          <div className='input-field'>
            <button className="waves-effect waves-light btn-large">Sign in</button>
          </div>
        </div>
      </form>
    </div>

React.render(<Auth/>, document.body)
