var InventoryBox = React.createClass({
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
  handleInventorySubmit: function (inventory) {

    $.ajax({
      url: '/inventory',
      dataType: 'json',
      type: 'POST',
      data: inventory,
      success: function (data) {
        this.setState({ datat: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    alert("Inventory Item Added");
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
        <div className="InventoryBox">
          <Inventoryform2 onInventorySubmit={this.handleInventorySubmit} />
        </div>
      );
    }
  }
});




var Inventoryform2 = React.createClass({
  getInitialState: function () {
    return {
      inventoryname: "",
      inventoryprice: "",
      inventoryquantity: "",
    };
  },

  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
  },

  handleSubmit: function (e) {

    e.preventDefault();

    var inventoryname = this.state.inventoryname.trim();
    var inventoryprice = this.state.inventoryprice.trim();
    var inventoryquantity = this.state.inventoryquantity;

    if (isNaN(inventoryquantity)) {
      console.log("Not a number " + inventoryquantity);
      return;
    }

    this.props.onInventorySubmit({
      inventoryname: inventoryname,
      inventoryprice: inventoryprice,
      inventoryquantity: inventoryquantity,
    });

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
          <form className="inventoryForm" onSubmit={this.handleSubmit}>

            <table>
              <tbody>
                <tr>
                  <th>Item Name</th>
                  <td>
                    <TextInput
                      value={this.state.inventoryname}
                      uniqueName="inventoryname"
                      textArea={false}
                      required={true}
                      minCharacters={6}
                      validate={this.commonValidate}
                      onChange={this.setValue.bind(this, 'inventoryname')}
                      errorMessage="Item Name is invalid"
                      emptyMessage="Item Name is required" />
                  </td>
                </tr>
                <tr>
                  <th>Price Per Item</th>
                  <td>

                    <TextInput
                      value={this.state.inventoryprice}
                      uniqueName="inventoryprice"
                      textArea={false}
                      required={true}
                      validate={this.validateDollars}
                      onChange={this.setValue.bind(this, 'inventoryprice')}
                      errorMessage="Item Price is invalid"
                      emptyMessage="Item Price is required" />
                  </td>
                </tr>
                <tr>
                  <th>Quantity On Hand</th>
                  <td>

                    <TextInput
                      value={this.state.inventoryquantity}
                      uniqueName="inventoryquantity"
                      textArea={false}
                      required={true}
                      validate={this.commonValidate}
                      onChange={this.setValue.bind(this, 'inventoryquantity')}
                      errorMessage=""
                      emptyMessage="Item quantity is required" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Insert Inventory" />
            </div>
          </form>
        </div>
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
  <InventoryBox />,
  document.getElementById('content')
);
