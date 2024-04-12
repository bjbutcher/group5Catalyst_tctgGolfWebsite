var NavBar = React.createClass({
  render: function () {
    return (
      <nav>
        <a href="Home.html">Home</a>
        <a href="About_Us.html">About Us</a>
        <a href="Restaurant.html">Restaurant</a>
        <a href="searchinventory.html">Browse Products</a>
        <a href="insertreservation.html">Book A Tee Time</a>
        <a href="insertplayer.html">Create Account</a>
        <a href="updateplayer.html">Edit Profile</a>
        <a href="login.html">Login</a>
      </nav>
    );
  }
});

ReactDOM.render(
  <NavBar />,
  document.getElementById('navBar')
);