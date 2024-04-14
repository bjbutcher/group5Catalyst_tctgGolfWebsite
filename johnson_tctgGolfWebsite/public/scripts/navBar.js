var NavBar = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      viewthepage: 0,
      playerName: "",
      loading: true
    };
  },
  loadAllowLogin: function () {
    $.ajax({
      url: '/customerlogin',
      dataType: 'json',
      cache: false,
      success: function (datalog) {
        this.setState({
          data: datalog,
          viewthepage: datalog[0].playerID,
          playerName: datalog[0].playerFirstName + " " + datalog[0].playerLastName,
          loading: false
        });
        console.log("Logged in:" + this.state.viewthepage + "," + this.state.playerName);
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
        <nav>
          <a href="Home.html">Home</a>
          <a href="About_Us.html">About Us</a>
          <a href="Restaurant.html">Restaurant</a>
          <a href="searchinventory.html">Browse Products</a>
          <a href="insertreservation.html">Book A Tee Time</a>
          {/* <a href="insertplayer.html">Create Account</a> */}
          <a href="updateplayer.html">Edit Profile</a>
          {/* <a href="login.html">Login</a> */}
          <a href="logout.html">Logout</a>
        </nav>
      );
    } else {
      return (
        <nav>
          <a href="Home.html">Home</a>
          <a href="About_Us.html">About Us</a>
          <a href="Restaurant.html">Restaurant</a>
          <a href="searchinventory.html">Browse Products</a>
          <a href="insertreservation.html">Book A Tee Time</a>
          <a href="insertplayer.html">Create Account</a>
          {/* <a href="updateplayer.html">Edit Profile</a> */}
          <a href="login.html">Login</a>
        </nav >
      );
    }
  }
});

ReactDOM.render(
  <NavBar />,
  document.getElementById('navBar')
);