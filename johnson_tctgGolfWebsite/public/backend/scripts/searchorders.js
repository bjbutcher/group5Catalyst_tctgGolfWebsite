var OrderBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadOrdersFromServer: function () {
    $.ajax({
      url: '/getord',
      data: {
        'orderid': orderid.value,
        'orderdate': orderdate.value,
        'ordertotal': ordertotal.value,
        'reservationid': orderres.value,
        'orderdetailid': orderdetailid.value,
        'inventoryid': orderinv.value,
        'orderdetailquantity': orderdetailquantity.value,
        'employeeid': orderemp.value
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
    this.loadOrdersFromServer();
    // setInterval(this.loadOrdersFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <div id="inputForm">
          <Orderform2 onOrderSubmit={this.loadOrdersFromServer} />
        </div>
        <br />
        <div id="resultList">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Date</th>
                <th>Order Total</th>
                <th>Reservation ID</th>
                <th>Order Detail ID</th>
                <th>Order Product</th>
                <th>Product Quantity</th>
                <th>Order Subtotal</th>
                <th>Order Employee</th>
              </tr>
            </thead>
            <OrderList data={this.state.data} />
          </table>

        </div>
      </div>
    );
  }
});

var Orderform2 = React.createClass({
  getInitialState: function () {
    return {
      orderid: "",
      orderdetailid: "",
      orderdate: "",
      ordertotal: "",
      orderdetailprice: "",
      orderdetailquantity: "",
      reservationid: "",
      inventoryid: "",
      employeeid: "",
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
    var orderid = this.state.orderid;
    var orderdetailid = this.state.orderdetailid;
    var orderdate = this.state.orderdate;
    var ordertotal = this.state.ordertotal.trim();
    var orderdetailprice = this.state.orderdetailprice.trim();
    var reservationid = orderres.value;
    var inventoryid = orderinv.value;
    var orderdetailquantity = this.state.orderdetailquantity.trim();
    var employeeid = orderemp.value;

    this.props.onOrderSubmit({
      orderid: orderid,
      orderdetailid: orderdetailid,
      orderdate: orderdate,
      ordertotal: ordertotal,
      orderdetailprice: orderdetailprice,
      reservationid: reservationid,
      inventoryid: inventoryid,
      orderdetailquantity: orderdetailquantity,
      employeeid: employeeid
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
                  <th>Order ID</th>
                  <td>
                    <input name="orderid" id="orderid" value={this.state.orderid} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Order Date</th>
                  <td>
                    <input type="date" name="orderdate" id="orderdate" value={this.state.orderdate} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Order Total</th>
                  <td>
                    <input type="number" name="ordertotal" id="ordertotal" value={this.state.ordertotal} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Reservation</th>
                  <td>
                    <ResSelectList data={this.state.resdata} />
                  </td>
                </tr>
                <tr>
                  <th>Order Detail ID</th>
                  <td>
                    <input name="orderdetailid" id="orderdetailid" value={this.state.orderdetailid} onChange={this.handleChange} />
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
                    <input type="number" name="orderdetailquantity" id="orderdetailquantity" value={this.state.orderdetailquantity} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Order Subtotal</th>
                  <td>
                    <input type="number" name="orderdetailprice" id="orderdetailprice" value={this.state.orderdetailprice} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Employee</th>
                  <td>
                    <SelectList data={this.state.data} />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Search Orders" />
            </div>
          </form>
        </div>
      </div >
    );
  }
});
var OrderList = React.createClass({
  render: function () {
    var orderNodes = this.props.data.map(function (order) {
      return (
        <Order
          key={order.orderID}
          ordid={order.orderID}
          ordate={order.orderDate}
          ordtotal={order.orderTotal}
          ordresid={order.reservationID}
          orddetid={order.orderDetailID}
          ordinvid={order.inventoryName}
          orddetqty={order.orderDetailQuantity}
          orddetprice={order.orderDetailPrice}
          orderemp={order.employeeLastName + ", " + order.employeeFirstName}
        >
        </Order>
      );

    });

    return (
      <tbody>
        {orderNodes}
      </tbody>
    );
  }
});



var Order = React.createClass({

  render: function () {



    return (

      <tr>
        <td>
          {this.props.ordid}
        </td>
        <td>
          {this.props.ordate}
        </td>
        <td>
          {this.props.ordtotal}
        </td>
        <td>
          {this.props.ordresid}
        </td>
        <td>
          {this.props.orddetid}
        </td>
        <td>
          {this.props.ordinvid}
        </td>
        <td>
          {this.props.orddetqty}
        </td>
        <td>
          {this.props.orddetprice}
        </td>
        <td>
          {this.props.orderemp}
        </td>
      </tr>
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
        <option value="">Select Product</option>
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
        <option value="">Select Reservation</option>
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
        <option value="">Select Employee</option>
        {optionNodes}
      </select>
    );
  }
});
ReactDOM.render(
  <OrderBox />,
  document.getElementById('content')
);