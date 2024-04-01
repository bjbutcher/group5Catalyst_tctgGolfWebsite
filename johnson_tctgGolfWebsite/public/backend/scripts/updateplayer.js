var PlayerBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadPlayersFromServer: function () {

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
    window.location.reload(true);
  },
  componentDidMount: function () {
    this.loadPlayersFromServer();
    // setInterval(this.loadPlayersFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <Playerform2 onPlayerSubmit={this.loadPlayersFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Rewards Points</th>
                  <th>Email</th>
                  <th>Player Status</th>
                  <th></th>
                </tr>
              </thead>
              <PlayerList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <PlayerUpdateform onUpdateSubmit={this.updateSinglePlyrFromServer} />
          </div>
        </div>
      </div>
    );
  }
});

var Playerform2 = React.createClass({
  getInitialState: function () {
    return {
      playerid: "",
      playerlastname: "",
      playerfirstname: "",
      playerrewardspoints: "",
      playeremail: "",
      playerstatus: "",
      data: []
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
  },


  handleSubmit: function (e) {
    e.preventDefault();

    var playerlastname = this.state.playerlastname.trim();
    var playerfirstname = this.state.playerfirstname.trim();
    var playerrewardspoints = this.state.playerrewardspoints.trim();
    var playeremail = this.state.playeremail;
    var playerstatus = this.state.selectedOption;

    this.props.onPlayerSubmit({
      playerlastname: playerlastname,
      playerfirstname: playerfirstname,
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
                      checked={this.state.selectedOption === "Active"}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    />Active
                    <input
                      type="radio"
                      name="plyrstatus"
                      id="plyrstatusinactive"
                      value="Inactive"
                      checked={this.state.selectedOption === "Inactive"}
                      onChange={this.handleOptionChange}
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
      upplayerrewardspoints: "",
      upplayeremail: "",
      upplayerstatus: "",
      upselectedOption: "",
      updata: []
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value
    });
  },

  handleUpSubmit: function (e) {
    e.preventDefault();

    var upplayerid = upplyrid.value;
    var upplayerlastname = upplyrlname.value;
    var upplayerfirstname = upplyrfname.value;
    var upplayerrewardspoints = upplyrrewards.value;
    var upplayeremail = upplyremail.value;
    var upplayerstatus = this.state.upselectedOption;

    this.props.onUpdateSubmit({
      upplayerid: upplayerid,
      upplayerlastname: upplayerlastname,
      upplayerfirstname: upplayerfirstname,
      upplayerrewardspoints: upplayerrewardspoints,
      upplayeremail: upplayeremail,
      upplayerstatus: upplayerstatus
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
        <div id="inputForm">
          <form onSubmit={this.handleUpSubmit}>

            <table>
              <tbody>
                <tr>
                  <th>Last Name</th>
                  <td>
                    <input type="text" name="upplyrlname" id="upplyrlname" value={this.state.upplyrlname} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>First Name</th>
                  <td>
                    <input type="text" name="upplyrfname" id="upplyrfname" value={this.state.upplyrfname} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Rewards Points</th>
                  <td>
                    <input type="number" name="upplyrrewards" id="upplyrrewards" value={this.state.upplyrrewards} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>
                    <input type="email" name="upplyremail" id="upplyremail" value={this.state.upplyremail} onChange={this.handleUpChange} />
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
                      checked={this.state.upselectedOption === "Active"}
                      onChange={this.handleUpOptionChange}
                      className="form-check-input"
                    />Active
                    <input
                      type="radio"
                      name="upplyrstatus"
                      id="upplyrstatusinactive"
                      value="Inactive"
                      checked={this.state.upselectedOption === "Inactive"}
                      onChange={this.handleUpOptionChange}
                      className="form-check-input"
                    />Inactive
                  </td>
                </tr>
              </tbody>
            </table><br />
            <div className="button-container">
              <input type="hidden" name="upplyrid" id="upplyrid" onChange={this.handleUpChange} />
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
          <form onSubmit={this.updateRecord}>
            <div className="updateButton">
              <input type="submit" value="Update Record" />
            </div>
          </form>
        </td>
      </tr>
    );
  }
});



ReactDOM.render(
  <PlayerBox />,
  document.getElementById('content')
);