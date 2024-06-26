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
  handlePlayerSubmit: function (player) {

    $.ajax({
      url: '/userCreatePlayer',
      dataType: 'json',
      type: 'POST',
      data: player,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    alert("Player Added");
  },
  componentDidMount: function () {
    this.loadAllowLogin();
  },
  render: function () {
    if (this.state.viewthepage < 2) {
      return (
        <div id="noPerms">You are not authorized to view this page.</div>
      );
    }
    else {
      return (
        <div className="PlayerBox">
          <Playerform2 onPlayerSubmit={this.handlePlayerSubmit} />
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
      playerstatus: "",
      playerrewardspoints: "",
      playeremail: "",
      playermembertype: ""
      // playerpw: "",
      // playerpw2: ""
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
    var playerstatus = this.state.selectedStatus;
    var playerrewardspoints = this.state.playerrewardspoints;
    var playeremail = this.state.playeremail.trim();
    var playermembertype = this.state.selectedType;
    // var playerpw = this.state.playerpw.trim();
    // var playerpw2 = this.state.playerpw2.trim();

    if (!this.validateEmail(playeremail)) {
      console.log("Bad Email!!!" + this.validateEmail(playeremail));
      return;
    }
    if (isNaN(playerrewardspoints)) {
      console.log("Not a number: " + playerrewardspoints);
      return;
    }

    // if (playerpw != playerpw2) {
    //   console.log("Passwords do not match!!");
    //   alert("Passwords do not match!!");
    //   return;
    // }

    if (!playerlastname || !playeremail) {
      console.log("Field Missing");
      return;
    }

    this.props.onPlayerSubmit({
      playerlastname: playerlastname,
      playerfirstname: playerfirstname,
      playerstatus: playerstatus,
      playerrewardspoints: playerrewardspoints,
      playermembertype: playermembertype,
      playeremail: playeremail,
      // playerpw: playerpw
    });

  },

  validateEmail: function (value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },
  validateDollars: function (value) {
    var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    return regex.test(value);
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
      <div id="inputForm">
        <form onSubmit={this.handleSubmit}>
          <table>
            <tbody>
              <tr>
                <th>Last Name</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.playerlastname}
                    uniqueName="playerlastname"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'playerlastname')}
                    errorMessage="Last Name is invalid"
                    emptyMessage="Last Name is required" />
                </td>
              </tr>
              <tr>
                <th>First Name</th>
                <td>
                  <TextInput
                    inputType="text"
                    value={this.state.playerfirstname}
                    uniqueName="playerfirstname"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'playerfirstname')}
                    errorMessage="First Name is invalid"
                    emptyMessage="First Name is required" />
                </td>
              </tr>
              <tr>
                <th>Email</th>
                <td>


                  <TextInput
                    inputType="email"
                    value={this.state.playeremail}
                    uniqueName="playeremail"
                    textArea={false}
                    required={true}
                    validate={this.validateEmail}
                    onChange={this.setValue.bind(this, 'playeremail')}
                    errorMessage="Invalid Email Address"
                    emptyMessage="Email Address is Required" />
                </td>
              </tr>
              {/* <tr>
                <th>Password</th>
                <td>
                  <TextInput
                    inputType="password"
                    value={this.state.playerpw}
                    uniqueName="playerpw"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'playerpw')}
                    errorMessage="Invalid Password"
                    emptyMessage="Password is Required" />
                </td>
              </tr> */}
              {/* <tr>
                <th>Password Confirm</th>
                <td>
                  <TextInput
                    inputType="password"
                    value={this.state.playerpw2}
                    uniqueName="playerpw2"
                    textArea={false}
                    required={true}
                    validate={this.commonValidate}
                    onChange={this.setValue.bind(this, 'playerpw2')}
                    errorMessage="Invalid Password"
                    emptyMessage="Password is Required" />
                </td>
              </tr> */}
              <tr>
                <th>
                  Reward Member Type
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
                  />Basic Member
                  <input
                    type="radio"
                    name="playermembertype"
                    id="premium"
                    value="1"
                    checked={this.state.selectedType === "1"}
                    onChange={this.handleTypeChange}
                    className="form-check-input"
                  />Premium Member
                </td>
              </tr>
              <tr>
                <th>Rewards Points</th>
                <td>
                  <TextInput
                    inputType="number"
                    value={this.state.playerrewardspoints}
                    uniqueName="playerrewardspoints"
                    textArea={false}
                    required={false}
                    validate={this.validateCommon}
                    onChange={this.setValue.bind(this, 'playerrewardspoints')}
                    errorMessage="Invalid point value"
                    emptyMessage="" />
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
            <input type="submit" value="New Player" />
          </div>
        </form>
      </div>
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
  <PlayerBox />,
  document.getElementById('content')
);
