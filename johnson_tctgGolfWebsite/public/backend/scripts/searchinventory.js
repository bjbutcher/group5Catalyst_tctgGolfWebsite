var InventoryBox = React.createClass({
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
  loadInventoryFromServer: function () {
    $.ajax({
      url: '/getinv',
      data: {
        'inventoryname': inventoryname.value,
        'inventoryquantity': inventoryquantity.value,
        'inventoryprice': inventoryprice.value,
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
    this.loadAllowLogin();
    if (this.state.viewthepage > 0) {
      this.loadInventoryFromServer();
      // setInterval(this.loadInventoryFromServer, this.props.pollInterval);
    }
  },

  render: function () {
    if (this.state.viewthepage < 1) {
      return (
        <div id="noPerms">You are not authorized to view this page.</div>
      );
    }
    else {
      return (
        <div>
          <div id="inputForm">
            <Inventoryform2 onInventorySubmit={this.loadInventoryFromServer} />
          </div>
          <br />
          <div id="resultList">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Name</th>
                  <th>Quantity On Hand</th>
                  <th>Price Per Item</th>
                </tr>
              </thead>
              <InventoryList data={this.state.data} />
            </table>
          </div>
        </div>
      );
    }
  }
});

var Inventoryform2 = React.createClass({
  getInitialState: function () {
    return {
      inventoryname: "",
      inventoryquantity: "",
      inventoryprice: "",
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
    var inventoryquantity = this.state.inventoryquantity.trim();
    var inventoryprice = this.state.inventoryprice.trim();


    this.props.onInventorySubmit({
      inventoryname: inventoryname,
      inventoryquantity: inventoryquantity,
      inventoryprice: inventoryprice,
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
                  <th>Item Name</th>
                  <td>
                    <input type="text" name="inventoryname" id="inventoryname" value={this.state.inventoryname} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Quantity On Hand</th>
                  <td>
                    <input name="inventoryquantity" id="inventoryquantity" value={this.state.inventoryquantity} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Price Per Item</th>
                  <td>
                    <input name="inventoryprice" id="inventoryprice" value={this.state.inventoryprice} onChange={this.handleChange} />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Search Inventory" />
            </div>
          </form>
        </div>
      </div >
    );
  }
});
var InventoryList = React.createClass({
  render: function () {
    var inventoryNodes = this.props.data.map(function (inventory) {
      return (
        <Inventory
          key={inventory.inventoryID}
          invkey={inventory.inventoryID}
          invname={inventory.inventoryName}
          invqty={inventory.inventoryQuantity}
          invprice={inventory.inventoryPrice}
        >
        </Inventory>
      );

    });

    return (
      <tbody>
        {inventoryNodes}
      </tbody>
    );
  }
});



var Inventory = React.createClass({

  render: function () {



    return (

      <tr>
        <td>
          {this.props.invkey}
        </td>
        <td>
          {this.props.invname}
        </td>
        <td>
          {this.props.invqty}
        </td>
        <td>
          ${this.props.invprice}
        </td>
      </tr>
    );
  }
});
ReactDOM.render(
  <InventoryBox />,
  document.getElementById('content')
);