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
  updateSingleOrdFromServer: function (order) {
    console.log("Starting update");
    $.ajax({
      url: '/updatesingleord',
      dataType: 'json',
      data: order,
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
  },
  componentDidMount: function () {
    this.loadOrdersFromServer();
    // setInterval(this.loadOrdersFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <Orderform2 onOrderSubmit={this.loadOrdersFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Order Total</th>
                  <th>Reservation ID</th>
                  <th>Order Detail ID</th>
                  <th>Product</th>
                  <th>Product Quantity</th>
                  <th>Order Subtotal</th>
                  <th>Order Employee</th>
                  <th></th>
                </tr>
              </thead>
              <OrderList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <OrderUpdateform onUpdateSubmit={this.updateSingleOrdFromServer} />
          </div>
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
                  <th>Date</th>
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
                  <th>Order Detail ID</th>
                  <td>
                    <input name="orderdetailid" id="orderdetailid" value={this.state.orderdetailid} onChange={this.handleChange} />
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
                    <input type="number" name="orderdetailquantity" id="orderdetailquantity" value={this.state.orderdetailquantity} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Order Employee</th>
                  <td><SelectList data={this.state.data} /></td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Search Orders" />
            </div>
          </form>
        </div>
        <div>
          <br />
          <form onSubmit={this.getInitialState}>
            <div className="button-container">
              <input type="submit" value="Clear Form" />
            </div>
          </form>
        </div>
      </div>
    );
  }
});

var OrderUpdateform = React.createClass({
  getInitialState: function () {
    return {
      uporderid: "",
      uporderdate: "",
      upordertotal: "",
      uporderdetailprice: "",
      // upreservationid: "",
      uporderdetailid: "",
      // upinventoryid: "",
      uporderdetailquantity: "",
      updata: [],
      upinvdata: [],
      upresdata: [],
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value
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
  handleUpSubmit: function (e) {
    e.preventDefault();

    var uporderid = upordid.value;
    var uporderdate = upordate.value;
    var upordertotal = upordtotal.value;
    var upreservationid = uporderres.value;
    var uporderdetailid = uporddetid.value;
    var upinventoryid = uporderinv.value;
    var uporderdetailquantity = uporddetqty.value;
    var uporderdetailprice = uporddetprice.value;
    var upemployeeid = uporderemp.value;

    this.props.onUpdateSubmit({
      uporderid: uporderid,
      uporderdate: uporderdate,
      upordertotal: upordertotal,
      upreservationid: upreservationid,
      uporderdetailid: uporderdetailid,
      upinventoryid: upinventoryid,
      uporderdetailquantity: uporderdetailquantity,
      uporderdetailprice: uporderdetailprice,
      upemployeeid: upemployeeid
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
        <div id="inputForm">
          <form onSubmit={this.handleUpSubmit}>

            <table>
              <tbody>
                <tr>
                  <th>Order Date</th>
                  <td>
                    <input name="upordate" id="upordate" value={this.state.upordate} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Order Total</th>
                  <td>
                    <input type="number" name="upordtotal" id="upordtotal" value={this.state.upordtotal} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Reservation</th>
                  <td>
                    <ResSelectUpdateList data={this.state.upresdata} />
                  </td>
                </tr>
                <tr>
                  <th>Order Detail ID</th>
                  <td>
                    <input name="uporddetid" id="uporddetid" value={this.state.uporddetid} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Product</th>
                  <td>
                    <InvSelectUpdateList data={this.state.upinvdata} />
                  </td>
                </tr>
                <tr>
                  <th>Product Quantity</th>
                  <td>
                    <input type="number" name="uporddetqty" id="uporddetqty" value={this.state.uporddetqty} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Order Subtotal</th>
                  <td>
                    <input type="number" name="uporddetprice" id="uporddetprice" value={this.state.uporddetprice} onChange={this.handleUpChange} />
                  </td>
                </tr>
                <tr>
                  <th>Employee</th>
                  <td>
                    <SelectUpdateList data={this.state.updata} />
                  </td>
                </tr>
              </tbody>
            </table><br />
            <div className="button-container">
              <input type="hidden" name="upordid" id="upordid" onChange={this.handleUpChange} />
              <input type="submit" value="Update Order" />
            </div>
          </form>
        </div>
      </div>
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

    //print all the nodes in the list
    return (
      <tbody>
        {orderNodes}
      </tbody>
    );
  }
});

var Order = React.createClass({
  getInitialState: function () {
    return {
      upordid: "",
      singledata: []
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupordid = this.props.ordid;

    this.loadSingleOrd(theupordid);
  },
  loadSingleOrd: function (theupordid) {
    $.ajax({
      url: '/getsingleord',
      data: {
        'upordid': theupordid
      },
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log("Get single order " + this.state.singledata);
        var populateCust = this.state.singledata.map(function (order) {
          upordid.value = theupordid;
          upordate.value = order.orderDate;
          upordtotal.value = order.orderTotal;
          uporderres.value = order.reservationID;
          uporddetid.value = order.orderDetailID;
          uporderinv.value = order.inventoryID;
          uporddetqty.value = order.orderDetailQuantity;
          uporddetprice.value = order.orderDetailPrice;
          uporderemp.value = order.employeeID;

        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

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
        <td>
          <form onSubmit={this.updateRecord}>
            <div className="updateButton">
              <input type="submit" value="Update Record" />
            </div>
          </form>
        </td>
      </tr>
    );
  }
});

var InvSelectUpdateList = React.createClass({
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
      <select name="uporderinv" id="uporderinv">
        {optionNodes}
      </select>
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
var ResSelectUpdateList = React.createClass({
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
      <select name="uporderres" id="uporderres">
        {optionNodes}
      </select>
    );
  }
});
var SelectUpdateList = React.createClass({
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
      <select name="uporderemp" id="uporderemp">
        {optionNodes}
      </select>
    );
  }
});

ReactDOM.render(
  <OrderBox />,
  document.getElementById('content')
);