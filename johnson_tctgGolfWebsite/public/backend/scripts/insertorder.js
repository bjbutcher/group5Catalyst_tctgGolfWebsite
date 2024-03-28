var OrderBox = React.createClass({
  handleOrderSubmit: function (order) {

    $.ajax({
      url: '/order',
      dataType: 'json',
      type: 'POST',
      data: order,
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
      <div className="OrderBox">
        <h1>New Order</h1>
        <Orderform2 onOrderSubmit={this.handleOrderSubmit} />
      </div>
    );
  }
});




var Orderform2 = React.createClass({
  getInitialState: function () {
    return {
      orderdate: "",
      ordertotal: "",
      orderdetailprice: "",
      orderdetailquantity: "",
      data: [],
      invdata: [],
      resdata: []
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value
    });
  },
  loadEmps: function () {
    $.ajax({
      url: '/getemps',
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
  loadInv: function () {
    $.ajax({
      url: '/getinvs',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ invdata: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadRes: function () {
    $.ajax({
      url: '/getrez',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ resdata: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function () {
    this.loadEmps();
    this.loadInv();
    this.loadRes();
  },
  handleSubmit: function (e) {

    e.preventDefault();

    var orderdate = this.state.orderdate;
    var ordertotal = this.state.ordertotal.trim();
    var orderdetailprice = this.state.orderdetailprice.trim();
    var reservationid = orderres.value;
    var inventoryid = orderinv.value;
    var orderdetailquantity = this.state.orderdetailquantity.trim();
    var employeeid = orderemp.value;



    this.props.onOrderSubmit({
      orderdate: orderdate,
      ordertotal: ordertotal,
      orderdetailprice: orderdetailprice,
      reservationid: reservationid,
      inventoryid: inventoryid,
      orderdetailquantity: orderdetailquantity,
      employeeid: employeeid
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
        <div id="theform">
          <form className="orderForm" onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>Employee</th>
                  <td>
                    <SelectList data={this.state.data} />
                  </td>
                </tr>
                <tr>
                  <th>Order Date</th>
                  <td>
                    <TextInput
                      inputType="date"
                      value={this.state.orderdate}
                      uniqueName="orderdate"
                      textArea={false}
                      required={true}
                      onChange={this.setValue.bind(this, 'orderdate')}
                      errorMessage="Order date is invalid"
                      emptyMessage="Order date is required" />
                  </td>
                </tr>
                <tr>
                  <th>Reservation</th>
                  <td>
                    <ResSelectList data={this.state.resdata} />
                  </td>
                </tr>
                <tr>
                  <th>Product</th>
                  <td>
                    <InvSelectList data={this.state.invdata} />
                  </td>
                </tr>
                <tr>
                  <th>Product Quantity</th>
                  <td>
                    <TextInput
                      inputType="number"
                      value={this.state.orderdetailquantity}
                      uniqueName="orderdetailquantity"
                      textArea={false}
                      required={true}
                      onChange={this.setValue.bind(this, 'orderdetailquantity')}
                      errorMessage="Product quantity is invalid" />
                  </td>
                </tr>
                <tr>
                  <th>Subtotal</th>
                  <td>
                    <TextInput
                      inputType="number"
                      value={this.state.orderdetailprice}
                      uniqueName="orderdetailprice"
                      textArea={false}
                      required={true}
                      onChange={this.setValue.bind(this, 'orderdetailprice')}
                      errorMessage="Order subtotal is invalid" />
                  </td>
                </tr>
                <tr>
                  <th>Order Total</th>
                  <td>
                    <TextInput
                      inputType="number"
                      value={this.state.ordertotal}
                      uniqueName="ordertotal"
                      textArea={false}
                      required={true}
                      onChange={this.setValue.bind(this, 'ordertotal')}
                      errorMessage="Order total is invalid" />
                  </td>
                </tr>


              </tbody>
            </table>
            <input type="submit" value="Insert Order" />

          </form>
        </div>
      </div>
    );
  }
});
var InvSelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (orderInv) {
      return (
        <option
          key={orderInv.inventoryID}
          value={orderInv.inventoryID}
        >
          {orderInv.inventoryName + ": $" + orderInv.inventoryPrice}
        </option>
      );
    });
    return (
      <select name="orderinv" id="orderinv">
        {optionNodes}
      </select>
    );
  }
});
var ResSelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (orderRes) {
      return (
        <option
          key={orderRes.reservationID}
          value={orderRes.reservationID}
        >
          {orderRes.reservationID}
        </option>
      );
    });
    return (
      <select name="orderres" id="orderres">
        {optionNodes}
      </select>
    );
  }
});
var SelectList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (orderEmp) {
      return (
        <option
          key={orderEmp.employeeID}
          value={orderEmp.employeeID}
        >
          {orderEmp.employeeLastName + ", " + orderEmp.employeeFirstName}
        </option>
      );
    });
    return (
      <select name="orderemp" id="orderemp">
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
  <OrderBox />,
  document.getElementById('content')
);
