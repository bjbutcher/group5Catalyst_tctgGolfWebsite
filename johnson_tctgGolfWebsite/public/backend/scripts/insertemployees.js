var EmployeeBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
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
  handleEmployeeSubmit: function (employee) {

    $.ajax({
      url: '/employee',
      dataType: 'json',
      type: 'POST',
      data: employee,
      success: function (data) {
        //We set the state again after submission, to update with the submitted data
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    alert("User Added");
  },

  componentDidMount: function () {
    this.loadAllowLogin();
  },
  render: function () {
    if (this.state.viewthepage < 5) {
      return (
        <div id="noPerms">You are not authorized to view this page.</div>
      );
    }
    else {
      return (
        <div className="EmployeeBox">
          <div id="theform">
            <Employeeform2 onEmployeeSubmit={this.handleEmployeeSubmit} />
          </div>
        </div>
      );
    }
  }
});

var Employeeform2 = React.createClass({
  getInitialState: function () {
    return {
      // employeeid: "",
      employeelastname: "",
      employeefirstname: "",
      employeeemail: "",
      employeepw: "",
      employeepw2: "",
      employeestatus: "",
      data: []
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
  },
  loadEmpTypes: function () {
    $.ajax({
      url: '/getemptypes',
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
    this.loadEmpTypes();
  },

  handleSubmit: function (e) {
    //we don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // var employeeid = this.state.employeeid.trim();
    var employeeemail = this.state.employeeemail.trim();
    var employeelastname = this.state.employeelastname.trim();
    var employeefirstname = this.state.employeefirstname.trim();
    var employeepw = this.state.employeepw.trim();
    var employeepw2 = this.state.employeepw2.trim();
    var employeestatus = this.state.selectedOption;
    var employeetype = emptype.value;
    console.log("PW: " + employeepw);



    if (employeepw != employeepw2) {
      console.log("Passwords do not match!!");
      alert("Passwords do not match!!");
      return;
    }

    if (!employeepw || !employeeemail) {
      console.log("Missed somthing")
      return;
    }

    this.props.onEmployeeSubmit({
      // employeeid: employeeid,
      employeelastname: employeelastname,
      employeefirstname: employeefirstname,
      employeeemail: employeeemail,
      employeestatus: employeestatus,
      employeetype: employeetype,
      employeepw: employeepw
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
      <div>
        <div id="inputForm">
          <form onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                {/* <tr>
                  <th>Employee ID</th>
                  <td>
                    <TextInput
                      value={this.state.employeeid}
                      uniqueName="employeeid"
                      textArea={false}
                      required={true}
                      minCharacters={6}
                      validate={this.commonValidate}
                      onChange={this.setValue.bind(this, 'employeeid')}
                      errorMessage="Employee ID is invalid"
                      emptyMessage="Employee ID is required" />
                  </td>
                </tr> */}
                <tr>
                  <th>Last Name</th>
                  <td>
                    <TextInput
                      value={this.state.employeelastname}
                      uniqueName="employeelastname"
                      textArea={false}
                      required={true}
                      validate={this.commonValidate}
                      onChange={this.setValue.bind(this, 'employeelastname')}
                      errorMessage="Last Name is invalid" />
                  </td>
                </tr>
                <tr>
                  <th>First Name</th>
                  <td>
                    <TextInput
                      value={this.state.employeefirstname}
                      uniqueName="employeefirstname"
                      textArea={false}
                      required={true}
                      validate={this.commonValidate}
                      onChange={this.setValue.bind(this, 'employeefirstname')}
                      errorMessage="First Name is invalid" />
                  </td>
                </tr>
                <tr>
                  <th>E-Mail</th>
                  <td>
                    <TextInput
                      inputType="text"
                      value={this.state.employeeemail}
                      uniqueName="employeeemail"
                      textArea={false}
                      required={true}
                      validate={this.validateEmail}
                      onChange={this.setValue.bind(this, 'employeeemail')}
                      errorMessage="Invalid E-Mail Address"
                      emptyMessage="E-Mail Address is Required" />
                  </td>
                </tr>
                <tr>
                  <th>Password</th>
                  <td>
                    <TextInput
                      inputType="password"
                      value={this.state.employeepw}
                      uniqueName="employeepw"
                      textArea={false}
                      required={true}
                      validate={this.commonValidate}
                      onChange={this.setValue.bind(this, 'employeepw')}
                      errorMessage="Invalid Password"
                      emptyMessage="Password is Required" />
                  </td>
                </tr>
                <tr>
                  <th>Password Confirm</th>
                  <td>
                    <TextInput
                      inputType="password"
                      value={this.state.employeepw2}
                      uniqueName="employeepw2"
                      textArea={false}
                      required={true}
                      validate={this.commonValidate}
                      onChange={this.setValue.bind(this, 'employeepw2')}
                      errorMessage="Invalid Password"
                      emptyMessage="Password is Required" />
                  </td>
                </tr>
                <tr>
                  <th>
                    Employee Status
                  </th>
                  <td>
                    <input
                      type="radio"
                      name="empstatus"
                      id="empstatusactive"
                      value="Active"
                      checked={this.state.selectedOption === "Active"}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                      required
                    />Active
                    <input
                      type="radio"
                      name="empstatus"
                      id="empstatusinactive"
                      value="Inactive"
                      checked={this.state.selectedOption === "Inactive"}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                      required
                    />Inactive
                  </td>
                </tr>
                <tr>
                  <th>
                    Employee Type
                  </th>
                  <td>
                    <SelectList data={this.state.data} required />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Insert User" />
            </div>
          </form>
        </div>
      </div>
    );
  }
});

var SelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (empTypes) {
      return (
        <option
          key={empTypes.employeeTypeID}
          value={empTypes.employeeTypeID}
        >
          {empTypes.employeeTypeName}
        </option>
      );
    });
    return (
      <select name="emptype" id="emptype">
        <option value="0"></option>
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
  <EmployeeBox />,
  document.getElementById('content')
);

