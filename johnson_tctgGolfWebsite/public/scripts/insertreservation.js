var ReservationBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
      viewthepage: 0,
      playerName: "",
      loading: true
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
  handleReservationSubmit: function (reservation) {

    $.ajax({
      url: '/reservation',
      dataType: 'json',
      type: 'POST',
      data: reservation,
      success: function (data) {
        if (data.success) {
          window.location.href = data.redirectUrl;
        } else {
          this.setState({ data: data });
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    alert("Reservation submitted successfully.");
  },
  componentDidMount: function () {
    this.loadAllowLogin();
  },

  render: function () {
    if (this.state.viewthepage === 0) {
      return (
        <div>Please log in to make a reservation.</div>
      );
    }
    else if (this.state.loading) {
      return (<div>Loading...</div>);
    }
    else {
      return (
        <div className="ReservationBox">
          <h1>Reserve A Tee Time</h1>
          <Reservationform2 onReservationSubmit={this.handleReservationSubmit} playerName={this.state.playerName} viewthepage={this.state.viewthepage} />
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
      reservationplayercount: 1,
      reservedDateTimes: [],
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
    var reservationdatetime = this.createDateTime(this.state.reservationdate, this.state.reservationtime);
    var reservationstatus = this.state.reservationstatus;
    var reservationplayer = this.props.viewthepage;
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
                      title="Select reservation date"
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
                      required
                      disabled={!this.state.reservationdate}>
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
                  <td>
                    <select
                      value={this.state.reservationstatus} onChange={this.setValue.bind(this, 'reservationstatus')} required>
                      <option value="">Please Select a Status</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Player Scheduling Reservation</th>
                  <td>
                    {this.props.playerName}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Reserve Tee Time" />
            </div>
          </form>
        </div>
      </div >
    );
  }
});

var InputError = React.createClass({
  getInitialState: function () {
    return {
      message: 'Input is invalid'
    };
  },
  render: function () {
    var errorClass = classNames(this.props.className, {
      'error_container': true,
      'visible': this.props.visible,
      'invisible': !this.props.visible
    });

    return (
      <td> {this.props.errorMessage} </td>
    )
  }
});

var TextInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === 'undefined') {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }
    else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    }
    else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible
    });

  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  render: function () {
    if (this.props.textArea) {
      return (
        <div className={this.props.uniqueName}>
          <textarea
            placeholder={this.props.text}
            className={'input input-' + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value} />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage} />
        </div>
      );
    } else {
      return (
        <div className={this.props.uniqueName}>
          <input
            type={this.props.inputType}
            name={this.props.uniqueName}
            id={this.props.uniqueName}
            placeholder={this.props.text}
            className={'input input-' + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value} />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage} />
        </div>
      );
    }
  }
});

ReactDOM.render(
  <ReservationBox />,
  document.getElementById('content')
);