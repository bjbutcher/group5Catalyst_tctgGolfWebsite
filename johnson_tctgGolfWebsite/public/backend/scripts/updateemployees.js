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
  updateSingleEmpFromServer: function (employee) {

    $.ajax({
      url: '/updatesingleemp',
      dataType: 'json',
      data: employee,
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
    alert("User Updated");
  },

  componentDidMount: function () {
    this.loadAllowLogin();
    if (this.state.viewthepage > 4) {
      this.loadEmployeesFromServer();
    }
    // setInterval(this.loadEmployeesFromServer, this.props.pollInterval);
  },

  render: function () {
    if (this.state.viewthepage < 5) {
      //if it's less than 5 (manager) then I'd like to let the user update/see their own info only
      //gotta figure out how to pass empuser id to the rest of the code without repeating it
      //maybe make certain divs conditional instead of the whole page?
      //look into later if time
      return (
        <div>You are not authorized to view this page.</div>
      );
    }
    else {
      return (
        <div>
          <Employeeform2 onEmployeeSubmit={this.loadEmployeesFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Type</th>
                    <th></th>
                  </tr>
                </thead>
                <EmployeeList data={this.state.data} />
              </table>
            </div>
            <br />
            <div id="theright">
              <EmployeeUpdateform onUpdateSubmit={this.updateSingleEmpFromServer} />
            </div>
          </div>
        </div >
      );
    }
  }
});

var Employeeform2 = React.createClass({
  getInitialState: function () {
    return {
      employeekey: "",
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
        <div className="button-container">
          <form onSubmit={this.getInitialState}>
            <input type="submit" value="Clear Form" />
          </form>
        </div>
      </div>
    );
  }
});

var EmployeeUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upemployeekey: "",
      upemployeeid: "",
      upemployeelastname: "",
      upemployeefirstname: "",
      upemployeeemail: "",
      upemployeestatus: "",
      upselectedOption: "",
      updata: []
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value
    });
  },
  loadEmpTypes: function () {
    $.ajax({
      url: '/getemptypes',
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
    this.loadEmpTypes();

  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upemployeekey = upempkey.value;
    var upemployeeid = upempid.value;
    var upemployeeemail = upempemail.value;
    var upemployeelastname = upemplname.value;
    var upemployeefirstname = upempfname.value;
    var upemployeestatus = this.state.upselectedOption;
    var upemployeetype = upemptype.value;

    this.props.onUpdateSubmit({
      upemployeekey: upemployeekey,
      upemployeeid: upemployeeid,
      upemployeelastname: upemployeelastname,
      upemployeefirstname: upemployeefirstname,
      upemployeeemail: upemployeeemail,

      upemployeestatus: upemployeestatus,
      upemployeetype: upemployeetype
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
                {/* <tr>
                  <th>Employee ID</th>
                  <td>
                    <input type="text" name="upempid" id="upempid" value={this.state.upempid} onChange={this.state.handleUpChange} />
                  </td>
                </tr> */}
                <tr>
                  <th>Last Name</th>
                  <td>
                    <input name="upemplname" id="upemplname" value={this.state.upemplname} onChange={this.state.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>First Name</th>
                  <td>
                    <input name="upempfname" id="upempfname" value={this.state.upempfname} onChange={this.state.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Employee Email</th>
                  <td>
                    <input name="upempemail" id="upempemail" value={this.state.upempemail} onChange={this.state.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>
                    Employee Status
                  </th>
                  <td>
                    <input
                      type="radio"
                      name="upempstatus"
                      id="upempstatusactive"
                      value="Active"
                      checked={this.state.upselectedOption === "Active"}
                      onChange={this.state.handleUpOptionChange}
                      className="form-check-input"
                    />Active
                    <input
                      type="radio"
                      name="upempstatus"
                      id="upempstatusinactive"
                      value="Inactive"
                      checked={this.state.upselectedOption === "Inactive"}
                      onChange={this.state.handleUpOptionChange}
                      className="form-check-input"
                    />Inactive
                  </td>
                </tr>
                <tr>
                  <th>
                    Employee Type
                  </th>
                  <td>
                    <SelectUpdateList data={this.state.updata} />
                  </td>
                </tr>
              </tbody>
            </table><br />
            <div className="button-container">
              <input type="hidden" name="upempkey" id="upempkey" onChange={this.state.handleUpChange} />
              <input type="submit" value="Update User" />
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
  getInitialState: function () {
    return {
      upempkey: "",
      singledata: []
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupempkey = this.props.empkey;

    this.loadSingleEmp(theupempkey);
  },
  loadSingleEmp: function (theupempkey) {
    $.ajax({
      url: '/getsingleemp',
      data: {
        'upempkey': theupempkey
      },
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateEmp = this.state.singledata.map(function (employee) {
          upempkey.value = theupempkey;
          upempemail.value = employee.employeeEmail;
          upempid.value = employee.employeeID;
          upemplname.value = employee.employeeLastName;
          upempfname.value = employee.employeeFirstName;
          if (employee.employeeStatus == "Active") {
            upempstatusactive.checked = true;
          } else {
            upempstatusinactive.checked = true;
          }
          upemptype.value = employee.employeeTypeID;

        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

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

var SelectUpdateList = React.createClass({
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
      <select name="upemptype" id="upemptype">
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