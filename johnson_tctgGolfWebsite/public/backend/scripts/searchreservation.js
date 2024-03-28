var ReservationBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadReservationsFromServer: function () {
    $.ajax({
      url: '/getres',
      data: {
        'reservationdatetime': reservationdate.value + 'T' + reservationtime.value,
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
  componentDidMount: function () {
    this.loadReservationsFromServer();
    // setInterval(this.loadReservationsFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <div id="theform">
          <h1>Reservations</h1>
          <Reservationform2 onReservationSubmit={this.loadReservationsFromServer} />
          <br />
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Date and Time</th>
                <th>Status</th>
                <th>Player Scheduling Reservation</th>
              </tr>
            </thead>
            <ReservationList data={this.state.data} />
          </table>

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
      data: []
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
  },
  convertTo24Hour: function (time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}:00`; // Assuming seconds as 00
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
  handleChange: function (event) {
    var partialState = {};
    partialState[event.target.id] = event.target.value;
    this.setState(partialState);
  },

  handleDateTimeChange: function () {
    var reservationdatetime = this.state.reservationdate + 'T' + this.state.reservationtime;
    this.setState({ reservationdatetime: reservationdatetime });
  },

  renderTimeOptions: function () {
    var timeOptions = [];
    var hours, minutes, ampm;

    for (var i = 480; i <= 960; i += 8) {
      hours = Math.floor(i / 60);
      minutes = i % 60;
      ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;

      var timeValue = `${hours}:${minutes} ${ampm}`;
      timeOptions.push(<option key={timeValue} value={timeValue}>{timeValue}</option>);
    }

    return timeOptions;
  },

  handleSubmit: function (e) {
    e.preventDefault();

    var reservationdatetime = this.createDateTime(this.state.reservationdate, this.state.reservationtime);
    var reservationstatus = document.getElementById('reservationstatus').value;
    var reservationplayer = document.getElementById('resplayer').value;

    this.props.onReservationSubmit({
      reservationdatetime: reservationdatetime,
      reservationstatus: reservationstatus,
      reservationplayer: reservationplayer
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
  commonValidate: function () {
    return true;
  },
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
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
                    <input type="time" name="reservationtime" id="reservationtime" value={this.state.reservationtime} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Reservation Date</th>
                  <td>
                    <input type="date" name="reservationdate" id="reservationdate" value={this.state.reservationdate} onChange={this.handleChange} />
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
                  <td>
                    <SelectList data={this.state.data} />
                  </td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Search Reservation" />

          </form>
        </div>
      </div >
    );
  }
});
var ReservationList = React.createClass({
  render: function () {
    var reservationNodes = this.props.data.map(function (reservation) {
      return (
        <Reservation
          key={reservation.reservationID}
          reskey={reservation.reservationID}
          resdatetime={reservation.reservationDateTime}
          resstatus={reservation.reservationStatus}
          resplayer={reservation.playerFirstName + " " + reservation.playerLastName}
        >
        </Reservation>
      );

    });

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
          {this.props.reskey}
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

ReactDOM.render(
  <ReservationBox />,
  document.getElementById('content')
);