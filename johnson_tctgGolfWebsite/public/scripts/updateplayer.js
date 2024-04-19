var PlayerBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      viewthepage: 0,
      playerName: "",
      loading: true,
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
        localStorage.setItem('viewthepage', datalog[0].playerID);
        localStorage.setItem('playerName', datalog[0].playerFirstName + " " + datalog[0].playerLastName);
        console.log("Logged in:" + this.state.viewthepage + "," + this.state.playerName);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  loadPlayerFromServer: function () {
    $.ajax({
      url: '/getsingleplyr',
      data: {
        'plyrid': this.props.viewthepage
      },
      cache: false,
      success: function (data) {
        this.setState({ data: data });
        console.log("Get single player " + this.state.data);
        var populatePlayer = this.state.data.map(function (player) {
          upplyrfname.value = player.playerFirstName;
          upplyrlname.value = player.playerLastName;
          upplyremail.value = player.playerEmail;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  updateSinglePlyrFromServer: function (player) {
    console.log("Starting update");
    $.ajax({
      url: '/editprofile',
      dataType: 'json',
      data: player,
      type: 'POST',
      cache: false,
      success: function (upsingledata) {
        this.setState({ upsingledata: upsingledata });

      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    window.location.reload(true);
    alert("Information updated.");
  },
  componentDidMount: function () {
    this.loadAllowLogin();
    if (this.state.viewthepage != 0) {
      (this.loadPlayerFromServer());
    }
  },
  render: function () {
    if (this.state.viewthepage === 0) {
      return (
        <div>Please log in to see this page.</div>
      );
    }
    else {
      return (
        <div id="playerInfo">
          <h1>Your Account</h1>
          <br />
          <div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Rewards Points</th>
                    <th>Membership Status</th>
                  </tr>
                </thead>
                <PlayerList data={this.state.data} />
              </table>
            </div>
            <div >
              <PlayerUpdateform viewthepage={this.state.viewthepage} onUpdateSubmit={this.updateSinglePlyrFromServer} />
            </div>
          </div>
        </div>
      );
    }
  }
});

var PlayerList = React.createClass({
  render: function () {
    var playerNodes = this.props.data.map(function (player) {
      return (
        <Player
          key={player.playerID}
          plyrlname={player.playerLastName}
          plyrfname={player.playerFirstName}
          plyrrewards={player.playerRewardsPoints}
          playermembertype={player.playerMemberRewardsType}
          plyremail={player.playerEmail}
        >
        </Player>
      );
    });
    return (
      <tbody>
        {playerNodes}
      </tbody>
    );
  }
});

var Player = React.createClass({
  render: function () {
    if (this.props.playermembertype == 0) {
      var thetype = "Basic";
    } else {
      var thetype = "Premium";
    }
    return (
      <tr>
        <td>
          {this.props.plyrfname}
        </td>
        <td>
          {this.props.plyrlname}
        </td>
        <td>
          {this.props.plyremail}
        </td>
        <td>
          {this.props.plyrrewards}
        </td>
        <td>
          {thetype}
        </td>
      </tr>
    )
  },


  getInitialState: function () {
    return {
      upplyrid: this.props.viewthepage,
      data: []
    };
  },
});

var PlayerUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upplayerid: this.props.viewthepage,
      upplayerlastname: "",
      upplayerfirstname: "",
      // upplayerrewardspoints: "",
      upplayeremail: "",
      // upplayerstatus: "",
      // upselectedOption: "",
      updata: []
    };
  },

  handleUpSubmit: function (e) {
    e.preventDefault();

    var upplayerid = this.props.viewthepage;
    var upplayerlastname = upplyrlname.value;
    var upplayerfirstname = upplyrfname.value;
    // var upplayerrewardspoints = upplyrrewards.value;
    var upplayeremail = upplyremail.value;
    // var upplayerstatus = this.state.upselectedOption;

    this.props.onUpdateSubmit({
      upplayerid: upplayerid,
      upplayerlastname: upplayerlastname,
      upplayerfirstname: upplayerfirstname,
      upplayeremail: upplayeremail,
    });
  },
  handleUpChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  },
  render: function () {

    return (
      <div>
        <div id="updateForm">
          <h2>Edit Your Information</h2>
          <form onSubmit={this.handleUpSubmit}>

            <table>
              <tbody>
                <tr>
                  <th>First Name</th>
                  <td data-label="First Name">
                    <input type="text" name="upplyrfname" id="upplyrfname" value={this.state.upplyrfname} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
                <tr>
                  <th>Last Name</th>
                  <td data-label="Last Name">
                    <input type="text" name="upplyrlname" id="upplyrlname" value={this.state.upplyrlname} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td data-label="Email">
                    <input type="email" name="upplyremail" id="upplyremail" value={this.state.upplyremail} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
              </tbody>
            </table><br />
            <div className="button-container">
              <input type="hidden" name="upplyrid" id="upplyrid" onChange={this.state.handleUpChange} />
              <input type="submit" value="Save Changes" />
            </div>
          </form>
        </div>
      </div>
    );
  }
});




ReactDOM.render(
  <PlayerBox />,
  document.getElementById('content')
);