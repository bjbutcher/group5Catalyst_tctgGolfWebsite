var PlayerBox = React.createClass({
  getInitialState: function () {
    return { data: [], viewthepage: 0 };
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
  loadPlayersFromServer: function () {
    this.loadAllowLogin(() => {
      if (this.state.viewthepage < 3) {
        console.log('Insufficient permission level');
        return;
      }
      var playermembertypevalue = 2;
      if (basic.checked) {
        playermembertypevalue = 0;
      }
      if (premium.checked) {
        playermembertypevalue = 1;
      }
      var playerstatusvalue = "Active";
      if (plyrstatusactive.checked) {
        playerstatusvalue = "Active";
      }
      if (plyrstatusinactive.checked) {
        playerstatusvalue = "Inactive";
      }

      $.ajax({
        url: '/getplyr',
        data: {
          'playerlastname': playerlastname.value,
          'playerfirstname': playerfirstname.value,
          'playermembertype': playermembertypevalue,
          'playerrewardspoints': playerrewardspoints.value,
          'playeremail': playeremail.value,
          'playerstatus': playerstatusvalue
        },

        dataType: 'json',
        cache: false,
        success: function (data) {
          this.setState({ data: data });
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
    )
  },
  componentDidMount: function () {
    this.loadPlayersFromServer();
    // setInterval(this.loadPlayersFromServer, this.props.pollInterval);
  },

  render: function () {
    if (this.state.viewthepage < 3) {
      return (
        <div id="noPerms">You are not authorized to view this page.</div>
      );
    }
    else {
      return (
        <div>
          <div id="inputForm">
            <Playerform2 onPlayerSubmit={this.loadPlayersFromServer} />
          </div>
          <br />
          <div id="resultList">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Reward Member Type</th>
                  <th>Rewards Points</th>
                  <th>Email</th>
                  <th>Player Status</th>
                </tr>
              </thead>
              <PlayerList data={this.state.data} />
            </table>

          </div>
        </div>
      );
    }
  }
});

var Playerform2 = React.createClass({
  getInitialState: function () {
    return {
      playerlastname: "",
      playerfirstname: "",
      playermembertype: "",
      playerrewardspoints: "",
      playeremail: "",
      playerstatus: "",
      data: []
    };
  },
  handleTypeChange: function (e) {
    this.setState({
      selectedType: e.target.value
    });
  },
  handleStatusChange: function (e) {
    this.setState({
      selectedStatus: e.target.value
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var playerlastname = this.state.playerlastname.trim();
    var playerfirstname = this.state.playerfirstname.trim();
    var playermembertype = this.state.selectedType;
    var playerrewardspoints = this.state.playerrewardspoints.trim();
    var playeremail = this.state.playeremail;
    var playerstatus = this.state.selectedStatus;

    this.props.onPlayerSubmit({
      playerlastname: playerlastname,
      playerfirstname: playerfirstname,
      playermembertype: playermembertype,
      playerrewardspoints: playerrewardspoints,
      playeremail: playeremail,
      playerstatus: playerstatus
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
        <div id="inputForm">
          <form onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>Last Name</th>
                  <td>
                    <input type="text" name="playerlastname" id="playerlastname" value={this.state.playerlastname} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>First Name</th>
                  <td>
                    <input type="text" name="playerfirstname" id="playerfirstname" value={this.state.playerfirstname} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>
                    Rewards Member Type
                  </th>
                  <td>
                    <input
                      type="radio"
                      name="playermembertype"
                      id="basic"
                      value="0"
                      checked={this.state.selectedType === "0"}
                      onChange={this.handleTypeChange}
                      className="form-check-input"
                    />Basic
                    <input
                      type="radio"
                      name="playermembertype"
                      id="premium"
                      value="1"
                      checked={this.state.selectedType === "1"}
                      onChange={this.handleTypeChange}
                      className="form-check-input"
                    />Premium
                  </td>
                </tr>
                <tr>
                  <th>Rewards Points</th>
                  <td>
                    <input type="number" name="playerrewardspoints" id="playerrewardspoints" value={this.state.playerrewardspoints} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>
                    <input type="email" name="playeremail" id="playeremail" value={this.state.playeremail} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>
                    Player Status
                  </th>
                  <td>
                    <input
                      type="radio"
                      name="plyrstatus"
                      id="plyrstatusactive"
                      value="Active"
                      checked={this.state.selectedStatus === "Active"}
                      onChange={this.handleStatusChange}
                      className="form-check-input"
                    />Active
                    <input
                      type="radio"
                      name="plyrstatus"
                      id="plyrstatusinactive"
                      value="Inactive"
                      checked={this.state.selectedStatus === "Inactive"}
                      onChange={this.handleStatusChange}
                      className="form-check-input"
                    />Inactive
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Search Players" />
            </div>
          </form>
        </div>
      </div >
    );
  }
});
var PlayerList = React.createClass({
  render: function () {
    var playerNodes = this.props.data.map(function (player) {
      return (
        <Player
          key={player.playerID}
          plyrkey={player.playerID}
          plyrlname={player.playerLastName}
          plyrfname={player.playerFirstName}
          plyrrewards={player.playerRewardsPoints}
          plyrremail={player.playerEmail}
          plyrstatus={player.playerStatus}
          playermembertype={player.playerMemberRewardsType}
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

    if (this.props.plyrstatus == "Active") {
      var thestatus = "Active";
    } else {
      var thestatus = "Inactive";
    }
    if (this.props.playermembertype == 0) {
      var thetype = "Basic";
    } else {
      var thetype = "Premium";
    }
    return (

      <tr>
        <td>
          {this.props.plyrkey}
        </td>
        <td>
          {this.props.plyrlname}
        </td>
        <td>
          {this.props.plyrfname}
        </td>
        <td>
          {thetype}
        </td>
        <td>
          {this.props.plyrrewards}
        </td>
        <td>
          {this.props.plyrremail}
        </td>
        <td>
          {thestatus}
        </td>
      </tr>
    );
  }
});


ReactDOM.render(
  <PlayerBox />,
  document.getElementById('content')
);