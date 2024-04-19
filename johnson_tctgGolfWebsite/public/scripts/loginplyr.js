var LoginBox = React.createClass({
  getInitialState: function () {
    return {
      data: []
    };
  },
  handleLogin: function (logininfo) {

    $.ajax({
      url: '/loginplyr/',
      dataType: 'json',
      type: 'POST',
      data: logininfo,
      success: function (data) {
        this.setState({ data: data });
        if (typeof data.redirect == 'string') {
          window.location = data.redirect;
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function () {
    return (
      <div>
        <LoginForm onLoginSubmit={this.handleLogin} />
        <br />

      </div>
    );
  }
});

var LoginForm = React.createClass({
  getInitialState: function () {
    return {
      playeremail: "",
      playerpw: "",

    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var playerpw = this.state.playerpw.trim();
    var playeremail = this.state.playeremail.trim();

    this.props.onLoginSubmit({
      playerpw: playerpw,
      playeremail: playeremail
    });

  },
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  },
  render: function () {

    return (
      <div>
        <div id="loginForm">
          <form onSubmit={this.handleSubmit}>

            <table>
              <tbody>
                <tr>
                  <th>Email</th>
                  <td data-label="Email">
                    <input type="email" name="playeremail" id="playeremail" value={this.state.playeremail} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Password</th>
                  <td data-label="Password">
                    <input type="password" name="playerpw" id="playerpw" value={this.state.playerpw} onChange={this.handleChange} />
                  </td>
                </tr>

              </tbody>
            </table><br />
            <div className="button-container">
              <input type="submit" value="Enter Login" />
            </div>
          </form>
        </div>
        <div>
          <br />
        </div>
      </div >
    );
  }
});

ReactDOM.render(
  <LoginBox />,
  document.getElementById('content')
);

