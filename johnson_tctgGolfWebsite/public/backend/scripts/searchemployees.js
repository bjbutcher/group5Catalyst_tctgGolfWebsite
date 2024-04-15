var EmployeeBox = React.createClass({
  getInitialState: function () {
    return { data: [], viewthepage: 0 };
  },
  loadAllowLogin: function () {
    $.ajax({
      url: '/getloggedin',
      dataType: 'json',
      cache: false,
      success: function (datalog) {
        this.setState({ data: datalog });
        this.setState({ viewthepage: this.state.data[0].employeePermissionLevel });
        console.log("Logged in:" + this.state.viewthepage);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadEmployeesFromServer: function () {
    this.loadAllowLogin();
    if (this.state.viewthepage < 5) {
      console.log('Insufficient permission level');
      return;
    }
    var estatusvalue = "Active";
    if (empstatusactive.checked) {
      estatusvalue = "Active";
    }
    if (empstatusinactive.checked) {
      estatusvalue = "Inactive";
    }
    console.log(estatusvalue);
    $.ajax({
      url: '/getemp',
      data: {
        'employeeid': employeeid.value,
        'employeelastname': employeelastname.value,
        'employeefirstname': employeefirstname.value,
        'employeeemail': employeeemail.value,
        'employeestatus': estatusvalue,
        'employeetype': emptype.value
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
    this.loadEmployeesFromServer(); // Modify this line
  },
  render: function () {
    if (this.state.viewthepage != 5) {
      return (
        <div id="noPerms">You are not authorized to view this page.</div>
      );
    }
    else {
      return (
        <div>
          <div id="inputForm">
            <Employeeform2 onEmployeeSubmit={this.loadEmployeesFromServer} />
          </div>
          <br />
          <div id="resultList">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Type</th>
                </tr>
              </thead>
              <EmployeeList data={this.state.data} />
            </table>
          </div>
        </div>
      );
    }
  }
});

var Employeeform2 = React.createClass({
  getInitialState: function () {
    return {
      employeeid: "",
      employeelastname: "",
      employeefirstname: "",
      employeeemail: "",
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
    e.preventDefault();

    var employeeid = this.state.employeeid.trim();
    var employeeemail = this.state.employeeemail.trim();
    var employeelastname = this.state.employeelastname.trim();
    var employeefirstname = this.state.employeefirstname.trim();
    var employeestatus = this.state.selectedOption;
    var employeetype = emptype.value;

    this.props.onEmployeeSubmit({
      employeeid: employeeid,
      employeelastname: employeelastname,
      employeefirstname: employeefirstname,
      employeeemail: employeeemail,
      employeestatus: employeestatus,
      employeetype: employeetype
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
        <div id="inputForm">
          <form onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>Employee ID</th>
                  <td>
                    <input type="text" name="employeeid" id="employeeid" value={this.state.employeeid} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Last Name</th>
                  <td>
                    <input name="employeelastname" id="employeelastname" value={this.state.employeelastname} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>First Name</th>
                  <td>
                    <input name="employeefirstname" id="employeefirstname" value={this.state.employeefirstname} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Employee Email</th>
                  <td>
                    <input name="employeeemail" id="employeeemail" value={this.state.employeeemail} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Employee Status</th>
                  <td>
                    <input
                      type="radio"
                      name="empstatus"
                      id="empstatusactive"
                      value="Active"
                      checked={this.state.selectedOption === "Active"}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    /> Active
                    <input
                      type="radio"
                      name="empstatus"
                      id="empstatusinactive"
                      value="Inactive"
                      checked={this.state.selectedOption === "Inactive"}
                      onChange={this.handleOptionChange}
                      className="form-check-input"
                    /> Inactive
                  </td>
                </tr>
                <tr>
                  <th>Employee Type</th>
                  <td><SelectList data={this.state.data} /></td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Search Users" />
            </div>
          </form>
        </div>
      </div>
    );
  }
});

var EmployeeList = React.createClass({
  render: function () {
    var employeeNodes = this.props.data.map(function (employee) {
      //map the data to individual donations
      return (
        <Employee
          key={employee.employeeID}
          empkey={employee.employeeID}
          empid={employee.employeeID}
          emplname={employee.employeeLastName}
          empfname={employee.employeeFirstName}
          empemail={employee.employeeEmail}
          empstatus={employee.employeeStatus}
          emptype={employee.employeeTypeName}
        >
        </Employee>
      );

    });

    //print all the nodes in the list
    return (
      <tbody>
        {employeeNodes}
      </tbody>
    );
  }
});



var Employee = React.createClass({

  render: function () {

    if (this.props.empstatus == "Active") {
      var thestatus = "Active";
    } else {
      var thestatus = "Inactive";
    }

    return (

      <tr>
        <td>
          {this.props.empid}
        </td>
        <td>
          {this.props.emplname}
        </td>
        <td>
          {this.props.empfname}
        </td>
        <td>
          {this.props.empemail}
        </td>
        <td>
          {thestatus}
        </td>
        <td>
          {this.props.emptype}
        </td>
      </tr>
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

ReactDOM.render(
  <EmployeeBox />,
  document.getElementById('content')
);