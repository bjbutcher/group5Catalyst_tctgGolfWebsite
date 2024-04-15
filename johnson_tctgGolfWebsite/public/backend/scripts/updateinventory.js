var InventoryBox = React.createClass({
  getInitialState: function () {
    return { data: [], viewthepage: 0 };
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
  loadInventoryFromServer: function () {
    this.loadAllowLogin(() => {
      if (this.state.viewthepage < 4) {
        console.log('Insufficient permission level');
        return;
      }
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
    }
    )
  },
  updateSingleInvFromServer: function (inventory) {
    console.log("Starting update");
    $.ajax({
      url: '/updatesingleinv',
      dataType: 'json',
      data: inventory,
      type: 'POST',
      cache: false,
      success: function (upsingledata) {
        this.setState({ upsingledata: upsingledata });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    alert("Inventory Item Updated");
    window.location.reload(true);
  },
  componentDidMount: function () {

    this.loadInventoryFromServer();
    // setInterval(this.loadInventoryFromServer, this.props.pollInterval);
  },

  render: function () {
    if (this.state.viewthepage < 4) {
      return (
        <div id="noPerms">You are not authorized to view this page.</div>
      );
    }
    else {
      return (
        <div>
          <Inventoryform2 onInventorySubmit={this.loadInventoryFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity On Hand</th>
                    <th>Price Per Item</th>
                    <th></th>
                  </tr>
                </thead>
                <InventoryList data={this.state.data} />
              </table>
            </div>
            <br />
            <div id="theright">
              <InventoryUpdateform onUpdateSubmit={this.updateSingleInvFromServer} />
            </div>
          </div>
        </div>
      );
    }
  }
});

var Inventoryform2 = React.createClass({
  getInitialState: function () {
    return {
      inventoryid: "",
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
        <div id="theform">
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
                  <th>Price Per Item</th>
                  <td>
                    <input name="inventoryprice" id="inventoryprice" value={this.state.inventoryprice} onChange={this.handleChange} />
                  </td>
                </tr>
                <tr>
                  <th>Quantity On Hand</th>
                  <td>
                    <input name="inventoryquantity" id="inventoryquantity" value={this.state.inventoryquantity} onChange={this.handleChange} />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="button-container">
              <input type="submit" value="Search Inventory" />
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

var InventoryUpdateform = React.createClass({
  getInitialState: function () {
    return {
      upinventoryid: "",
      upinventoryname: "",
      upinventoryquantity: "",
      upinventoryprice: "",
    };
  },
  handleUpOptionChange: function (e) {
    this.setState({
      upselectedOption: e.target.value
    });
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upinventoryid = upinvid.value;
    var upinventoryname = upinvname.value;
    var upinventoryquantity = upinvqty.value;
    var upinventoryprice = upinvprice.value;

    this.props.onUpdateSubmit({
      upinventoryid: upinventoryid,
      upinventoryname: upinventoryname,
      upinventoryquantity: upinventoryquantity,
      upinventoryprice: upinventoryprice,
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
                <tr>
                  <th>Item Name</th>
                  <td>
                    <input type="text" name="upinvname" id="upinvname" value={this.state.upinvname} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
                <tr>
                  <th>Quantity On Hand</th>
                  <td>
                    <input name="upinvqty" id="upinvqty" value={this.state.upinvqty} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
                <tr>
                  <th>Price Per Item</th>
                  <td>
                    <input name="upinvprice" id="upinvprice" value={this.state.upinvprice} onChange={this.state.handleUpChange} required />
                  </td>
                </tr>
              </tbody>
            </table><br />
            <div className="button-container">
              <input type="hidden" name="upinvid" id="upinvid" onChange={this.state.handleUpChange} />
              <input type="submit" value="Update Inventory" />
            </div>
          </form>
        </div>
      </div>
    );
  }
});

var InventoryList = React.createClass({
  render: function () {
    var inventoryNodes = this.props.data.map(function (inventory) {
      return (
        <Inventory
          key={inventory.inventoryID}
          invid={inventory.inventoryID}
          invname={inventory.inventoryName}
          invqty={inventory.inventoryQuantity}
          invprice={inventory.inventoryPrice}



        >
        </Inventory>
      );

    });

    //print all the nodes in the list
    return (
      <tbody>
        {inventoryNodes}
      </tbody>
    );
  }
});

var Inventory = React.createClass({
  getInitialState: function () {
    return {
      upinvid: "",
      singledata: []
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theupinvid = this.props.invid;

    this.loadSingleInv(theupinvid);
  },
  loadSingleInv: function (theupinvid) {
    $.ajax({
      url: '/getsingleinv',
      data: {
        'upinvid': theupinvid
      },
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log("Get single item " + this.state.singledata);
        var populateInv = this.state.singledata.map(function (inventory) {
          upinvid.value = theupinvid;
          upinvname.value = inventory.inventoryName;
          upinvqty.value = inventory.inventoryQuantity;
          upinvprice.value = inventory.inventoryPrice;
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
          {this.props.invid}
        </td>
        <td>
          {this.props.invname}
        </td>
        <td>
          {this.props.invqty}
        </td>
        <td>
          {this.props.invprice}
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
ReactDOM.render(
  <InventoryBox />,
  document.getElementById('content')
);