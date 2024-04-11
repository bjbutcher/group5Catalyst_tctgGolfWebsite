var ReservationBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      reservationDate: "",
      reservationTime: "",
      reservationstatus: "",
      reservationPlayer: "",
      reservationplayercount: ""
    };
  },
  loadReservationsFromServer: function (formState) {
    var reservationDateTime = formState.reservationDate && formState.reservationTime ? formState.reservationDate + 'T' + formState.reservationTime : '';

    $.ajax({
      url: '/getres',
      data: {
        'reservationdatetime': reservationDateTime,
        'reservationstatus': formState.reservationstatus,
        'reservationplayer': resplayer.value,
        'reservationplayercount': formState.reservationplayercount
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
  updateFormState: function (date, time, status, playerCount, playerId) {
    this.refs.reservationUpdateForm.setState({
      upresdate: date,
      uprestime: time,
      upresstatus: status,
      uppresplaycount: playerCount,
      upresplayer: playerId
    });
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
              <ReservationList data={this.state.data} updateFormState={this.updateFormState} />
            </table>
          </div>
          <br />
          <div id="theright">
            <ReservationUpdateform ref="reservationUpdateForm" onUpdateSubmit={this.updateSingleResFromServer} />
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
      reservationplayercount: "",
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

    this.setState({

      [event.target.id]: event.target.value
    });


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

    var reservationdatetime = "";
    if (this.state.reservationdate && this.state.reservationtime) {
      reservationdatetime = this.createDateTime(this.state.reservationdate, this.state.reservationtime);
    }
    var reservationstatus = this.state.reservationstatus;
    var reservationplayer = resplayer.value;
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
  setValue(field, event) {
    const value = event.target.value !== "" ? event.target.value : null;
    this.setState({ [field]: value });
  },
  render: function () {

    return (
      <div>
        <div id="inputForm">
          <form className="reservationForm" onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>Reservation Date</th>
                  <td>
                    <input
                      type="date"
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
                      value={this.state.reservationtime}
                      onChange={this.handleChange}
                    >
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
                      onChange={this.setValue.bind(this, 'reservationplayercount')}
                    >
                    </input>
                  </td>
                </tr>
                <tr>
                  <th>Reservation Status</th>
                  <td><select name="reservationstatus" id="reservationstatus"
                    value={this.state.reservationstatus} onChange={this.handleChange}>
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
                    <SelectList data={this.state.data} />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Search Reservations" />
            </div>
          </form>
        </div>
        <div className="button-container">
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
    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    } else if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    return date + 'T' + hours + ':' + minutes + ':00';
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upreservationid = upresid.value;
    var upreservationdatetime = this.state.upresdate + 'T' + this.state.uprestime;
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
        <div id="updateForm">
          <form onSubmit={this.handleUpSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>Reservation Date</th>
                  <td>
                    <input
                      type="date"
                      uniqueName="upresdate"
                      id="upresdate"
                      value={this.state.upresdate}
                      onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Time</th>
                  <td>
                    <select
                      id="uprestime"
                      value={this.state.uprestime}
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
                      id="uppresplaycount"
                      value={this.state.uppresplaycount}
                      onChange={this.handleUpChange}
                      required>
                    </input>
                  </td>
                </tr>
                <tr>
                  <th>Reservation Status</th>
                  <td>
                    <select id="upresstatus" name="upresstatus"
                      value={this.state.upresstatus} onChange={this.handleUpChange.bind(this, 'upresstatus')} required>
                      <option value="0">Please Select a Status</option>
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
          resplayer={reservation.playerFirstName + " " + reservation.playerLastName}
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

    this.loadSingleRes(theupresid, function (data) {
      var dateTimeSplit = data.reservationDateTime.split('T');
      var datePart = dateTimeSplit[0];
      var timePart = this.formatTimeForSelect(dateTimeSplit[1]);

      this.props.updateFormState(datePart, timePart, data.reservationStatus, data.reservationPlayerCount, data.playerID);
    }.bind(this));
  },
  loadSingleRes: function (theupresid) {
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
          var dateTimeSplit = reservation.reservationDateTime.split('T');
          var datePart = dateTimeSplit[0];
          var timePart = this.formatTimeForSelect(dateTimeSplit[1]);

          upresid.value = theupresid;
          upresdate.value = datePart;
          uprestime.value = timePart;
          upresstatus.value = reservation.reservationStatus;
          uppresplaycount.value = reservation.reservationPlayerCount;
          upresplayer.value = reservation.playerID;
        }.bind(this));
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  formatTimeForSelect: function (time24h) {
    let [hours, minutes] = time24h.split(':');
    hours = parseInt(hours, 10);
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = parseInt(minutes, 10);
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
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
        <td>{this.props.rescount}</td>

        <td>
          {this.props.resplayer}
        </td>
        <td>
          {this.props.resstatus}
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