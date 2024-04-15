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
      var playerstatusvalue = 'Active';
      if (plyrstatusactive.checked) {
        playerstatusvalue = 'Active';
      }
      if (plyrstatusinactive.checked) {
        playerstatusvalue = 'Inactive';
      }
      $.ajax({
        url: '/getplyr',
        data: {
          'playerlastname': playerlastname.value,
          'playerfirstname': playerfirstname.value,
          'playermembertype': playermembertypevalue,
          'playerrewardspoints': playerrewardspoints.value,
          'playeremail': playeremail.value,
          'playerstatus': playerstatusvalue,
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
  updateSinglePlyrFromServer: function (player) {
    console.log("Starting update");
    $.ajax({
      url: '/updatesingleplyr',
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
    alert("Player Updated");
    window.location.reload(true);
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
          <Playerform2 onPlayerSubmit={this.loadPlayersFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
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
                    <th></th>
                  </tr>
                </thead>
                <PlayerList data={this.state.data} />
              </table>
            </div>
            <br />
            <div id="theright">
              <PlayerUpdateform onUpdateSubmit={this.updateSinglePlyrFromServer} />
            </div>
          </div>
        </div>
      );
    }
  }
});

var Playerform2 = React.createClass({
  getInitialState: function () {
    return {
      playerid: "",
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
                  <th>Player Status</th>
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
                    /> Inactive
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Search Players" />
            </div>
          </form>
        </div>
        <br />
        <div>

          <div className="button-container">
            <form onSubmit={this.getInitialState}>
              <input type="submit" value="Clear Form" />
            </form>
          </div>
        </div>
      </div >
    );
  }
});

var PlayerUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upplayerid: "",
      upplayerlastname: "",
      upplayerfirstname: "",
      upplayermembertype: "",
      upplayerrewardspoints: "",
      upplayeremail: "",
      upplayerstatus: "",
      upselectedType: "",
      upselectedStatus: "",
      updata: []
    };
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upplayerid = upplyrid.value;
    var upplayerlastname = upplyrlname.value;
    var upplayerfirstname = upplyrfname.value;
    var upplayermembertype = this.state.upselectedType;
    var upplayerrewardspoints = upplyrrewards.value;
    var upplayeremail = upplyremail.value;
    var upplayerstatus = this.state.upselectedStatus;

    this.props.onUpdateSubmit({
      upplayerid: upplayerid,
      upplayerlastname: upplayerlastname,
      upplayerfirstname: upplayerfirstname,
      upplayermembertype: upplayermembertype,
      upplayerrewardspoints: upplayerrewardspoints,
      upplayeremail: upplayeremail,
      upplayerstatus: upplayerstatus
    });
  },
  handleUpChange: function (event) {
    const { id, value } = event.target;
    this.setState({
      [id]: value
    });
  },

  handleUpTypeChange: function (e) {
    console.log("Type Change:", e.target.value);
    this.setState({
      upselectedType: e.target.value
    });
  },

  handleUpStatusChange: function (e) {
    console.log("Status Change:", e.target.value);
    this.setState({
      upselectedStatus: e.target.value
    });
  },

  render: function () {
    console.log("Render State:", this.state.upselectedType, this.state.upselectedStatus);


    return (
      <div>
        <div id="updateForm">
          <form onSubmit={this.handleUpSubmit}>

            <table>
              <tbody>
                <tr>
                  <th>Last Name</th>
                  <td>
                    <input type="text" name="upplyrlname" id="upplyrlname" value={this.state.upplyrlname} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
                <tr>
                  <th>First Name</th>
                  <td>
                    <input type="text" name="upplyrfname" id="upplyrfname" value={this.state.upplyrfname} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
                <tr>
                  <th>
                    Rewards Member Type
                  </th>
                  <td>
                    <input
                      type="radio"
                      name="upplayermembertype"
                      id="upbasic"
                      value="0"
                      checked={this.state.upselectedType === "0"}
                      onChange={this.state.handleUpTypeChange}
                      className="form-check-input"
                      required
                    />Basic
                    <input
                      type="radio"
                      name="upplayermembertype"
                      id="uppremium"
                      value="1"
                      checked={this.state.upselectedType === "1"}
                      onChange={this.state.handleUpTypeChange}
                      className="form-check-input"
                      required
                    />Premium
                  </td>
                </tr>
                <tr>
                  <th>Rewards Points</th>
                  <td>
                    <input type="number" name="upplyrrewards" id="upplyrrewards" value={this.state.upplyrrewards} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>
                    <input type="email" name="upplyremail" id="upplyremail" value={this.state.upplyremail} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
                <tr>
                  <th>
                    Player Status
                  </th>
                  <td>
                    <input
                      type="radio"
                      name="upplyrstatus"
                      id="upplyrstatusactive"
                      value="Active"
                      checked={this.state.upselectedStatus === "Active"}
                      onChange={this.state.handleUpStatusChange}
                      className="form-check-input"
                      required
                    />Active
                    <input
                      type="radio"
                      name="upplyrstatus"
                      id="upplyrstatusinactive"
                      value="Inactive"
                      checked={this.state.upselectedStatus === "Inactive"}
                      onChange={this.state.handleUpStatusChange}
                      className="form-check-input"
                      required
                    />Inactive
                  </td>
                </tr>
              </tbody>
            </table><br />
            <div className="button-container">
              <input type="hidden" name="upplyrid" id="upplyrid" onChange={this.state.handleUpChange} />
              <input type="submit" value="Update Player" />
            </div>
          </form>
        </div>
      </div>
    );
  }
});

var PlayerList = React.createClass({
  render: function () {
    var playerNodes = this.props.data.map(function (player) {
      return (
        <Player
          key={player.playerID}
          plyrid={player.playerID}
          plyrlname={player.playerLastName}
          plyrfname={player.playerFirstName}
          plyrrewards={player.playerRewardsPoints}
          plyremail={player.playerEmail}
          plyrstatus={player.playerStatus}
          playermembertype={player.playerMemberRewardsType}
        >
        </Player>
      );

    });

    //print all the nodes in the list
    return (
      <tbody>
        {playerNodes}
      </tbody>
    );
  }
});

var Player = React.createClass({
  getInitialState: function () {
    return {
      upplyrid: "",
      singledata: []
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupplyrid = this.props.plyrid;

    this.loadSinglePlyr(theupplyrid);
  },
  loadSinglePlyr: function (theupplyrid) {
    $.ajax({
      url: '/getsingleplyr',
      data: {
        'upplyrid': theupplyrid
      },
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log("Get single player " + this.state.singledata);
        var populateInv = this.state.singledata.map(function (player) {
          upplyrid.value = theupplyrid;
          upplyrlname.value = player.playerLastName;
          upplyrfname.value = player.playerFirstName;
          upplyrrewards.value = player.playerRewardsPoints;
          upplyremail.value = player.playerEmail;
          if (player.playerMemberRewardsType == 0) {
            upbasic.checked = true;
          } else {
            uppremium.checked = true;
          }
          if (player.playerStatus == 'Active') {
            upplyrstatusactive.checked = true;
          } else {
            upplyrstatusinactive.checked = true;
          }

        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },


  render: function () {
    if (this.props.playermembertype == 0) {
      var thetype = "Basic";
    } else {
      var thetype = "Premium";
    }
    if (this.props.plyrstatus == "Active") {
      var thestatus = "Active";
    } else {
      var thestatus = "Inactive";
    }

    return (

      <tr>
        <td>
          {this.props.plyrid}
        </td>
        <td>
          {this.props.plyrlname}
        </td>
        <td>
          {this.props.plyrfname}
        </td>
        <td>{thetype}</td>
        <td>
          {this.props.plyrrewards}
        </td>
        <td>
          {this.props.plyremail}
        </td>
        <td>
          {thestatus}
        </td>
        <td>
          <div className="updateButton">
            <form onSubmit={this.updateRecord}>
              <input type="submit" value="Update Record" />
            </form>
          </div>
        </td>
      </tr>
    );
  }
});



ReactDOM.render(
  <PlayerBox />,
  document.getElementById('content')
);