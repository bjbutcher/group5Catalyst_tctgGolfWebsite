var LogNav = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      viewthepage: 0
    };
  },
  loadAllowLogin: function (callback) {
    $.ajax({
      url: '/getloggedin',
      dataType: 'json',
      cache: false,
      success: function (datalog) {
        this.setState({ data: datalog });
        this.setState({ viewthepage: this.state.data[0].employeePermissionLevel }, callback);
        console.log("Logged in:" + this.state.viewthepage);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function () {
    this.loadAllowLogin();
  },

  render: function () {
    if (this.state.viewthepage != 0) {
      return (
        <a href="logout.html">Logout</a>);
    }
    else {
      return (
        <a href="index.html">Login</a>
      );
    }
  }
});

ReactDOM.render(
  <LogNav />,
  document.getElementById('log')
);