var ReservationBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadReservationsFromServer: function () {


    $.ajax({
      url: '/getres',
      data: {
        'reservationdatetime': reservationdatetime.value,
        'reservationstatus': reservationstatus.value,
        'reservationplayer': resplayer.value
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
  updateSingleResFromServer: function (reservation) {
    console.log("Starting update");
    $.ajax({
      url: '/updatesingleres',
      dataType: 'json',
      data: reservation,
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
    this.loadReservationsFromServer();
    // setInterval(this.loadReservationsFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <h1>Update Reservation</h1>
        <Reservationform2 onReservationSubmit={this.loadReservationsFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date and Time</th>
                  <th>Status</th>
                  <th>Player Scheduling Reservation</th>
                  <th></th>
                </tr>
              </thead>
              <ReservationList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <ReservationUpdateform onUpdateSubmit={this.updateSingleResFromServer} />
          </div>
        </div>
      </div>
    );
  }
});

var Reservationform2 = React.createClass({
  getInitialState: function () {
    return {
      reservationid: "",
      reservationdatetime: "",
      reservationstatus: "",
      data: []
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
  },
  loadResPlayer: function () {
    $.ajax({
      url: '/getplayers',
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
  componentDidMount: function () {
    this.loadResPlayer();
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var reservationdatetime = this.state.reservationdatetime.trim();
    var reservationstatus = this.state.reservationstatus;
    var reservationplayer = resplayer.value;

    this.props.onReservationSubmit({
      reservationdatetime: reservationdatetime,
      reservationstatus: reservationstatus,
      reservationplayer: reservationplayer
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
        <div id="theform">
          <form onSubmit={this.handleSubmit}>

            <table>
              <tbody>
                <tr>
                  <th>Reservation Time</th>
                  <td>
                    <input type="date" name="reservationdatetime" id="reservationdatetime" value={this.state.reservationdatetime} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Status</th>
                  <td><select emptyMessage="Status is required" name="reservationstatus" id="reservationstatus" defaultValue={this.state.selectValue} onChange={this.setValue.bind(this, 'reservationstatus')} required>
                    <option value="" selected disabled>Please Select a Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Completed">Completed</option>
                  </select>
                  </td>
                </tr>
                <tr>
                  <th>Player Scheduling Reservation</th>
                  <td><SelectList data={this.state.data} /></td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Search Reservations" />

          </form>
        </div>
        <div>
          <br />
          <form onSubmit={this.getInitialState}>
            <input type="submit" value="Clear Form" />
          </form>
        </div>
      </div>
    );
  }
});

var ReservationUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upreservationid: "",
      upreservationdatetime: "",
      upreservationstatus: "",
      updata: []
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value
    });
  },
  loadResPlayer: function () {
    $.ajax({
      url: '/getplayers',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ updata: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function () {
    this.loadResPlayer();

  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upreservationid = upresid.value;
    var upreservationdatetime = upresdatetime.value;
    var upreservationstatus = upresstatus.value;
    var upreservationplayer = upresplayer.value;

    this.props.onUpdateSubmit({
      upreservationid: upreservationid,
      upreservationdatetime: upreservationdatetime,
      upreservationstatus: upreservationstatus,
      upreservationplayer: upreservationplayer
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
        <div id="theform">
          <form onSubmit={this.handleUpSubmit}>

            <table>
              <tbody>
                <tr>
                  <th>Reservation Time</th>
                  <td>
                    <input type="date" name="upresdatetime" id="upresdatetime" value={this.state.upresdatetime} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Status</th>
                  <td><select emptyMessage="Status is required" name="upreservationstatus" id="upreservationstatus" defaultValue={this.state.selectValue} onChange={this.setValue.bind(this, 'upreservationstatus')} required>
                    <option value="" selected disabled>Please Select a Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Completed">Completed</option>
                  </select>
                  </td>
                </tr>
                <tr>
                  <th>Player Scheduling Reservation</th>
                  <td>
                    <SelectUpdateList data={this.state.updata} />
                  </td>
                </tr>
              </tbody>
            </table><br />
            <input type="hidden" name="upresid" id="upresid" onChange={this.handleUpChange} />
            <input type="submit" value="Update Reservation" />
          </form>
        </div>
      </div>
    );
  }
});

var ReservationList = React.createClass({
  render: function () {
    var reservationNodes = this.props.data.map(function (reservation) {
      return (
        <Reservation
          key={reservation.reservationID}
          resid={reservation.reservationID}
          resdatetime={reservation.reservationDateTime}
          resstatus={reservation.reservationStatus}
          resplayer={reservation.resPlayerName}
        >
        </Reservation>
      );

    });

    //print all the nodes in the list
    return (
      <tbody>
        {reservationNodes}
      </tbody>
    );
  }
});

var Reservation = React.createClass({
  getInitialState: function () {
    return {
      upresid: "",
      singledata: []
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupresid = this.props.resid;

    this.loadSingleRest(theupresid);
  },
  loadSingleRest: function (theupresid) {
    $.ajax({
      url: '/getsingleres',
      data: {
        'upresid': theupresid
      },
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log("Get single reservation " + this.state.singledata);
        var populateRes = this.state.singledata.map(function (reservation) {
          upresid.value = theupresid;
          upresdatetime.value = reservation.reservationDateTime;
          upresstatus.value = reservation.reservationStatus;
          upresplayer.value = reservation.playerID;

        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  render: function () {


    return (

      <tr>
        <td>
          {this.props.resid}
        </td>
        <td>
          {this.props.resdatetime}
        </td>
        <td>
          {this.props.resstatus}
        </td>
        <td>
          {this.props.resplayer}
        </td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
      </tr>
    );
  }
});

var SelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (resPlayer) {
      return (
        <option
          key={resPlayer.playerID}
          value={resPlayer.playerID}
        >
          {resPlayer.resPlayerName}
        </option>
      );
    });
    return (
      <select name="resplayer" id="resplayer">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  }
});

var SelectUpdateList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (resPlayer) {
      return (
        <option
          key={resPlayer.playerID}
          value={resPlayer.playerID}
        >
          {resPlayer.resPlayerName}
        </option>
      );
    });
    return (
      <select name="upresplayer" id="upresplayer">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  }
});

ReactDOM.render(
  <ReservationBox />,
  document.getElementById('content')
);