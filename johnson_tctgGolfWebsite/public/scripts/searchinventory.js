var InventoryBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadInventoryFromServer: function () {
    $.ajax({
      url: '/getInvDisplay',
      data: {
        'inventoryname': inventoryname.value,
        // 'inventoryquantity': inventoryquantity.value,
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
    this.loadInventoryFromServer();
    // setInterval(this.loadInventoryFromServer, this.props.pollInterval);
  },

  render: function () {
    return (
      <div>
        <div id="productDisplay">
          <Inventoryform2 onInventorySubmit={this.loadInventoryFromServer} />
          <br />
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <InventoryList data={this.state.data} />
          </table>

        </div>
      </div>
    );
  }
});

var Inventoryform2 = React.createClass({
  getInitialState: function () {
    return {
      inventoryname: "",
      // inventoryquantity: "",
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
    // var inventoryquantity = this.state.inventoryquantity.trim();
    var inventoryprice = this.state.inventoryprice.trim();


    this.props.onInventorySubmit({
      inventoryname: inventoryname,
      // inventoryquantity: inventoryquantity,
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
                  <th>Product Name</th>
                  <td>
                    <input type="text" name="inventoryname" id="inventoryname" value={this.state.inventoryname} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Price</th>
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
          <div id="productName">
            {this.props.invname}
          </div>
          <div id="productID">
            Product ID:{this.props.invkey}
          </div>
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