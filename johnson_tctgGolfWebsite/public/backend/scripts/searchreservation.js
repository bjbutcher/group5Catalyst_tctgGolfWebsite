var ReservationBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      reservationDate: "",
      reservationTime: "",
      reservationstatus: "",
      reservationPlayer: "",
      reservationplayercount: "",
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
  loadReservationsFromServer: function (formState) {
    this.loadAllowLogin(() => {
      if (this.state.viewthepage < 2) {
        console.log('Insufficient permission level');
        return;
      }
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
    }
    )
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
  render: function () {
    if (this.state.viewthepage < 2) {
      return (
        <div id="noPerms">You are not authorized to view this page.</div>
      );
    }
    else {
      return (
        <div>
          <div id="inputForm">
            <Reservationform2 onReservationSubmit={this.loadReservationsFromServer} onFormChange={this.handleFormChange} />
          </div>
          <br />
          <div id="resultList">
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
        </div>
      );
    }
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
      reservedDateTimes: [],
      data: [],
      loadingReservedTimes: false
    };
  },
  handleChange: function (event) {
    var partialState = {};
    partialState[event.target.id] = event.target.value;
    this.setState(partialState, () => {
      if (event.target.id === "reservationdate") {
        this.setState({ reservationtime: '', loadingReservedTimes: true }, this.getReservedDateTimes);
      }
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
    })
  },
  componentDidMount: function () {
    this.loadResPlayer();
  },
  getReservedDateTimes: function () {
    if (!this.state.reservationdate) return;
    $.ajax({
      url: '/getReservedDateTime',
      dataType: 'json',
      cache: false,
      success: function (data) {
        let filteredDateTimes = data.filter(dt => {
          let reservedDate = new Date(dt.reservationDateTime).toISOString().split('T')[0];
          return reservedDate === this.state.reservationdate;
        }).map(dt => new Date(dt.reservationDateTime).toISOString());
        this.setState({ reservedDateTimes: filteredDateTimes, loadingReservedTimes: false });

      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({ loadingReservedTimes: false });
      }.bind(this)
    });
  },
  renderTimeOptions: function () {
    if (!this.state.reservationdate || this.state.loadingReservedTimes) {
      return [];
    }
    var timeOptions = [];
    var startTime = 480;
    var endTime = 960;
    var timeIncrement = 8;
    var reservedTimes = this.state.reservedDateTimes;
    console.log('Reserved Times:', reservedTimes);
    for (var i = startTime; i <= endTime; i += timeIncrement) {
      var hours = Math.floor(i / 60);
      var minutes = i % 60;
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      var timeValue = `${hours}:${minutes} ${ampm}`;
      var dateParts = this.state.reservationdate.split('-');
      var optionDateTime = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes)).toISOString();
      console.log('Generated Time Slot:', optionDateTime);
      if (!reservedTimes.includes(optionDateTime)) {
        timeOptions.push(<option key={timeValue} value={timeValue}>{timeValue}</option>);
      }
    }
    return timeOptions;
  },
  commonValidate: function () {
    return true;
  },
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
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
        <div>
          <br />
          <div className="button-container">
            <form onSubmit={this.getInitialState}>
              <input type="submit" value="Clear Form" />
            </form>
            <form onSubmit={this.viewDeletes}>
              <input type="submit" value="View Deleted Reservations" />
            </form>
          </div>
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
        <option key="" value="">Please Select Player</option>
        {optionNodes}
      </select>
    );
  }
});

ReactDOM.render(
  <ReservationBox />,
  document.getElementById('content')
);