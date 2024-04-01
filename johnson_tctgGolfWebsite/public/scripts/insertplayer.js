var PlayerBox = React.createClass({
  handlePlayerSubmit: function (player) {

    $.ajax({
      url: '/playerCreateAccount',
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
  },
  render: function () {
    return (
      <div className="PlayerBox">
        <h1>Create New Account</h1>
        <Playerform2 onPlayerSubmit={this.handlePlayerSubmit} />
      </div>
    );
  }
});

var Playerform2 = React.createClass({
  getInitialState: function () {
    return {
      playerlastname: "",
      playerfirstname: "",
      // playerstatus: "",
      // playerrewardspoints: "",
      playeremail: "",
      playerpw: "",
      playerpw2: ""
    };
  },

  handleSubmit: function (e) {

    e.preventDefault();

    var playerlastname = this.state.playerlastname.trim();
    var playerfirstname = this.state.playerfirstname.trim();
    // var playerstatus = this.state.selectedOption;
    // var playerrewardspoints = this.state.playerrewardspoints;
    var playeremail = this.state.playeremail.trim();
    var playerpw = this.state.playerpw.trim();
    var playerpw2 = this.state.playerpw2.trim();

    if (!this.validateEmail(playeremail)) {
      console.log("Bad Email!!!" + this.validateEmail(playeremail));
      return;
    }
    // if (isNaN(playerrewardspoints)) {
    //   console.log("Not a number: " + playerrewardspoints);
    //   return;
    // }

    if (playerpw != playerpw2) {
      console.log("Passwords do not match!!");
      alert("Passwords do not match!!");
      return;
    }

    if (!playerlastname || !playerfirstname || !playeremail) {
      console.log("Field Missing");
      return;
    }

    this.props.onPlayerSubmit({
      playerlastname: playerlastname,
      playerfirstname: playerfirstname,
      // playerstatus: playerstatus,
      // playerrewardspoints: playerrewardspoints,
      playeremail: playeremail,
      playerpw: playerpw
    });

  },
  matchPassword: function (playerpw2) {
    return this.state.playerpw1 === playerpw2;
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
              <tr>
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
              </tr>
              <tr>
                <th>Password Confirm</th>
                <td>
                  <TextInput
                    inputType="password"
                    value={this.state.playerpw2}
                    uniqueName="playerpw2"
                    textArea={false}
                    required={true}
                    validate={() => this.matchPassword(this.state.playerpw2)}
                    onChange={this.setValue.bind(this, 'playerpw2')}
                    errorMessage="Invalid Password"
                    emptyMessage="Password is Required" />
                </td>
              </tr>
              {/* <tr>
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
              </tr> */}
              {/* <tr>
                <th>
                  Player Status
                </th>
                <td>
                  <input
                    type="radio"
                    name="plyrstatus"
                    id="plyrstatusactive"
                    value="Active"
                    checked={this.state.upselectedOption === "Active"}
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
                  />Inactive
                </td>
              </tr> */}
            </tbody>
          </table>
          <div className="button-container">
            <input type="submit" value="Create Account" />
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
