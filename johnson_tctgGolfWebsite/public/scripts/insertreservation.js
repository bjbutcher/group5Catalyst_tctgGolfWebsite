var ReservationBox = React.createClass({
  handleReservationSubmit: function (reservation) {

    $.ajax({
      url: '/reservation',
      dataType: 'json',
      type: 'POST',
      data: reservation,
      success: function (data) {
        this.setState({ datat: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    return (
      <div className="ReservationBox">
        <h1>Schedule A Tee Time</h1>
        <Reservationform2 onReservationSubmit={this.handleReservationSubmit} />
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
        <div id="theForm">
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
                      required>
                      <option value="">Select Time</option>
                      {this.renderTimeOptions()}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Reservation Status</th>
                  <td><select emptyMessage="Status is required" name="reservationstatus" id="reservationstatus" defaultValue={this.state.selectValue} onChange={this.setValue.bind(this, 'reservationstatus')} required>
                    <option value="" selected disabled>Please Select a Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Rescheduled">Rescheduled</option>
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
              <input type="submit" value="Insert Reservation" />
            </div>
          </form>
        </div>
      </div>
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
