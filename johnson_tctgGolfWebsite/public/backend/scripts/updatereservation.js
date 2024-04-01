var ReservationBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      reservationDate: "",
      reservationTime: "",
      reservationStatus: "",
      reservationPlayer: "",
      reservationPlayerCount: ""
    };
  },
  loadReservationsFromServer: function (formState) {
    var reservationDateTime = formState.reservationDate && formState.reservationTime ? formState.reservationDate + 'T' + formState.reservationTime : '';

    $.ajax({
      url: '/getres',
      data: {
        'reservationdatetime': reservationDateTime,
        'reservationstatus': formState.reservationStatus,
        'reservationplayer': formState.reservationPlayer,
        'reservationplayercount': formState.reservationPlayerCount
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
  componentDidMount: function () {
    this.loadReservationsFromServer(this.state);
  },

  handleFormChange: function (newState) {
    this.setState(newState);
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


  render: function () {
    return (
      <div>
        <Reservationform2 onReservationSubmit={this.loadReservationsFromServer} onFormChange={this.handleFormChange} />
        <br />
        <div id="theresults">
          <div id="theleft">
            <br />
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Date and Time</th>
                  <th>Number of Players</th>
                  <th>Player Reserved</th>
                  <th>Status</th>
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
      reservationdate: "",
      reservationtime: "",
      reservationdatetime: "",
      reservationstatus: "",
      reservationplayercount: 1,
      data: [],
      reservedDateTimes: []
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
    $.ajax({
      url: '/getReservedDateTime',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ reservedDateTime: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function () {
    this.loadResPlayer();
  },
  handleChange: function (event) {
    var partialState = {};
    partialState[event.target.id] = event.target.value;
    this.setState(partialState);

    if (event.target.id === "reservationdate") {
      this.setState({ reservationtime: '' });
    }
  },

  handleDateTimeChange: function () {
    var reservationdatetime = this.state.reservationdate + 'T' + this.state.reservationtime;
    this.setState({ reservationdatetime: reservationdatetime });
  },

  renderTimeOptions: function () {
    var timeOptions = [];
    var reservedTimes = this.state.reservedDateTime ?
      this.state.reservedDateTime.map(rt => rt.reservationDateTime) : [];

    var hours, minutes, ampm;

    for (var i = 480; i <= 960; i += 8) {
      hours = Math.floor(i / 60);
      minutes = i % 60;
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      var timeValue = `${hours}:${minutes} ${ampm}`;
      var optionDateTime = this.createDateTime(this.state.reservationdate, timeValue);

      if (!reservedTimes.includes(optionDateTime)) {
        timeOptions.push(<option key={timeValue} value={timeValue}>{timeValue}</option>);
      }
    }

    return timeOptions;
  },



  handleSubmit: function (e) {
    e.preventDefault();

    var reservationdatetime = this.createDateTime(this.state.reservationdate, this.state.reservationtime);
    var reservationstatus = this.state.reservationstatus;
    var reservationplayer = this.state.reservationplayer;
    var reservationplayercount = this.state.reservationplayercount;

    this.props.onReservationSubmit({
      reservationdatetime: reservationdatetime,
      reservationstatus: reservationstatus,
      reservationplayer: reservationplayer,
      reservationplayercount: reservationplayercount,
    });

  },
  createDateTime: function (date, time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return date + 'T' + hours + ':' + minutes + ':00';
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
                  <th>Reservation Date</th>
                  <td>
                    <input
                      type="date"
                      title="Select reservation date"
                      uniqueName="reservationdate"
                      id="reservationdate"
                      value={this.state.reservationdate}
                      onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Time</th>
                  <td>
                    <select
                      id="reservationtime"
                      title="Select reservation time"
                      value={this.state.reservationtime}
                      onChange={this.handleChange}
                      required>
                      <option value="">Select Time</option>
                      {this.renderTimeOptions()}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Number of Players for Reservation</th>
                  <td>
                    <input
                      type="number"
                      title="Select number of players who want to play during this reservation"
                      id="reservationplayercount"
                      value={this.state.reservationplayercount}
                      onChange={this.handleChange}
                      required>
                    </input>
                  </td>
                </tr>
                <tr>
                  <th>Reservation Status</th>
                  <td> <select
                    value={this.state.reservationstatus} onChange={this.handleChange.bind(this, 'reservationstatus')} required>
                    <option value="">Please Select a Status</option>
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
            <div className="button-container">
              <input type="submit" value="Search Reservations" />
            </div>
          </form>
        </div>
        <div>
          <br />
          <form onSubmit={this.getInitialState}>
            <div className="button-container">
              <input type="submit" value="Clear Form" />
            </div>
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
  renderTimeOptions: function () {
    var timeOptions = [];
    var reservedTimes = this.state.reservedDateTime ?
      this.state.reservedDateTime.map(rt => rt.reservationDateTime) : [];

    var hours, minutes, ampm;

    for (var i = 480; i <= 960; i += 8) {
      hours = Math.floor(i / 60);
      minutes = i % 60;
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      var timeValue = `${hours}:${minutes} ${ampm}`;
      var optionDateTime = this.createDateTime(this.state.reservationdate, timeValue);

      if (!reservedTimes.includes(optionDateTime)) {
        timeOptions.push(<option key={timeValue} value={timeValue}>{timeValue}</option>);
      }
    }

    return timeOptions;
  },
  createDateTime: function (date, time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return date + 'T' + hours + ':' + minutes + ':00';
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upreservationid = upresid.value;
    var upreservationdatetime = upresdatetime.value;
    var upreservationstatus = upresstatus.value;
    var upreservationplayer = upresplayer.value;
    var upreservationplayercount = uppresplaycount.value;


    this.props.onUpdateSubmit({
      upreservationid: upreservationid,
      upreservationdatetime: upreservationdatetime,
      upreservationstatus: upreservationstatus,
      upreservationplayer: upreservationplayer,
      upreservationplayercount: upreservationplayercount
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
                  <th>Reservation Date</th>
                  <td>
                    <input
                      type="date"
                      uniqueName="upreservationdate"
                      id="upreservationdate"
                      value={this.state.upreservationdate}
                      onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Time</th>
                  <td>
                    <select
                      id="upreservationtime"
                      value={this.state.upreservationtime}
                      onChange={this.handleUpChange}
                      required>
                      <option value="">Select Time</option>
                      {this.renderTimeOptions()}
                    </select>                  </td>
                </tr>
                <tr>
                  <th>Number of Players for Reservation</th>
                  <td>
                    <input
                      type="number"
                      title="Select number of players who want to play during this reservation"
                      id="upreservationplayercount"
                      value={this.state.upreservationplayercount}
                      onChange={this.handleUpChange}
                      required>
                    </input>
                  </td>
                </tr>
                <tr>
                  <th>Reservation Status</th>
                  <td><select
                    value={this.state.upreservationstatus} onChange={this.handleUpChange.bind(this, 'upreservationstatus')} required>
                    <option value="">Please Select a Status</option>
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
            <div className="button-container">
              <input type="hidden" name="upresid" id="upresid" onChange={this.handleUpChange} />
              <input type="submit" value="Update Reservation" />
            </div>
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
          resplayer={reservation.playerID}
          rescount={reservation.reservationPlayerCount}
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
          uppresplaycount.value = reservation.reservationPlayerCount;
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
          {this.props.reskey}
        </td>
        <td>
          {this.props.resdatetime}
        </td>
        <td>{this.props.rescount}</td>

        <td>
          {this.props.resplayer}
        </td>
        <td>
          {this.props.resstatus}
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

var SelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (resPlayer) {
      return (
        <option
          key={resPlayer.playerID}
          value={resPlayer.playerID}
        >
          {resPlayer.playerFirstName + " " + resPlayer.playerLastName}
        </option>
      );
    });
    return (
      <select name="resplayer" id="resplayer">
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
          {resPlayer.playerFirstName + " " + resPlayer.playerLastName}
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