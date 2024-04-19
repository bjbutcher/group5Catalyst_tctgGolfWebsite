'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 3000

const con = mysql.createConnection({
  host: "istwebclass.org",
  user: "jjohn172_admin",
  password: "H00244755H00244755",
  database: "jjohn172_tctgGolf",
  timezone: 'Z'
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!!");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "/public/Home.html"));
});


app.get('/getloggedout/', function (req, res) {
  res.cookie('token', 2, { maxAge: 0 })
  res.send({ redirect: '/Home.html' });
});
app.get('/playerlogout/', function (req, res) {
  res.cookie('token', 2, { maxAge: 0 })
  res.send({ redirect: '/home.html' });
});
app.get('/getloggedin/', function (req, res) {

  var viewpage = 0;
  var datahold = [];
  const validtoken = req.cookies.token
  console.log('token new:', validtoken);
  var payload;

  if (!validtoken) {
    viewpage = 0;
    console.log("NVT");
  } else {
    try {
      payload = jwt.verify(validtoken, jwtKey);
      console.log('payload new:', payload.empkey);
      viewpage = payload.empkey;

      var sqlsel = 'select * from employee where employeeID = ?';
      var inserts = [viewpage];

      var sql = mysql.format(sqlsel, inserts);

      con.query(sql, function (err, data) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log("Logged In: ", data);

        datahold = data;

        res.send(JSON.stringify(data));
      });

    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        viewpage = 0;
        console.log("NVT2");
      }
      viewpage = 0;
      console.log("NVT3");
    }
  }

});
app.get('/customerlogin/', function (req, res) {

  var viewpage = 0;
  var datahold = [];
  const validtoken = req.cookies.token
  console.log('token new:', validtoken);
  var payload;

  if (!validtoken) {
    viewpage = 0;
    console.log("NVT");
  } else {
    try {
      payload = jwt.verify(validtoken, jwtKey);
      console.log('payload new:', payload.playkey);
      viewpage = payload.playkey;

      var sqlsel = 'select * from players where playerID = ?';
      var inserts = [viewpage];

      var sql = mysql.format(sqlsel, inserts);

      con.query(sql, function (err, data) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log("Logged In: ", data);

        datahold = data;

        res.send(JSON.stringify(data));
      });

    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        viewpage = 0;
        console.log("NVT2");
      }
      viewpage = 0;
      console.log("NVT3");
    }
  }

});
app.post('/loginemp/', function (req, res) {
  var eemail = req.body.employeeemail;
  var epw = req.body.employeepw;

  var sqlsel = 'select * from employee where employeeEmail = ?';

  var inserts = [eemail];

  var sql = mysql.format(sqlsel, inserts);
  console.log(sql);

  con.query(sql, function (err, data) {
    //Checks to see if there is data in the result
    if (data.length > 0) {
      console.log("User name correct: ");
      var empkey = data[0].employeeID;
      console.log(data[0].employeeID);

      bcrypt.compare(epw, data[0].employeePassword, function (err, passwordCorrect) {
        if (err) {
          throw err;
        } else if (!passwordCorrect) {
          console.log("Password Incorrect");
        } else {
          console.log("Password Correct");
          const token = jwt.sign({ empkey }, jwtKey, {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
          });

          res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
          res.send({ redirect: '/backend/searchemployee.html' });
        }
      });
    } else {
      console.log("Incorrect user name or password!!");
    }
  });
});
app.post('/loginplyr/', function (req, res) {
  var pmail = req.body.playeremail;
  var ppw = req.body.playerpw;

  var sqlsel = 'select * from players where playerEmail = ?';

  var inserts = [pmail];

  var sql = mysql.format(sqlsel, inserts);
  console.log(sql);

  con.query(sql, function (err, data) {
    //Checks to see if there is data in the result
    if (data.length > 0) {
      console.log("User name correct: ");
      var playkey = data[0].playerID;
      console.log(data[0].playerID);

      bcrypt.compare(ppw, data[0].playerPassword, function (err, passwordCorrect) {
        if (err) {
          throw err;
        } else if (!passwordCorrect) {
          console.log("Password Incorrect");
        } else {
          console.log("Password Correct");
          const token = jwt.sign({ playkey }, jwtKey, {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
          });

          res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
          res.send({ redirect: '/Home.html' });
        }
      });
    } else {
      console.log("Incorrect user name or password!!");
    }
  });
});

app.post('/updatesingleinv', function (req, res) {
  var iname = req.body.upinventoryname;
  var iprice = req.body.upinventoryprice;
  var iqty = req.body.upinventoryquantity;
  var iid = req.body.upinventoryid;
  var sqlins = "UPDATE inventory SET inventoryName = ?, inventoryPrice = ?, inventoryQuantity = ? WHERE inventoryID = ?";
  var inserts = [iname, iprice, iqty, iid];
  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    res.end();
  });
});

app.get('/getsingleinv/', function (req, res) {
  var iid = req.query.upinvid;

  var sqlsel = 'select * from inventory where inventoryID = ?'
  var inserts = [iid];
  var sql = mysql.format(sqlsel, inserts);
  console.log("Item retrieved.");
  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});


app.get('/getinv/', function (req, res) {
  var iname = req.query.inventoryname;
  var iprice = req.query.inventoryprice;
  var iqty = req.query.inventoryquantity;



  var sqlsel = 'Select * FROM inventory where inventoryName Like ? and inventoryPrice Like ? and inventoryQuantity Like ? and inventoryStatus = "Active"'

  var inserts = [`%` + iname + `%`, `%` + iprice + `%`, `%` + iqty + `%`];

  var sql = mysql.format(sqlsel, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});
app.get('/getInvDisplay/', function (req, res) {
  var iname = req.query.inventoryname;
  var iprice = req.query.inventoryprice;



  var sqlsel = 'Select * FROM inventory where inventoryName Like ? and inventoryPrice Like ?'

  var inserts = [`%` + iname + `%`, `%` + iprice + `%`];

  var sql = mysql.format(sqlsel, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});
app.post('/inventory', function (req, res) {
  var iname = req.body.inventoryname;
  var iprice = req.body.inventoryprice;
  var iqty = req.body.inventoryquantity;



  var sqlins = "INSERT INTO inventory (inventoryName, inventoryPrice, inventoryQuantity) VALUES (?,?,?)";

  var inserts = [iname, iprice, iqty];

  var sql = mysql.format(sqlins, inserts);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect('insertinventory.html');
    res.end();
  });
}
);


app.post('/updatesingleplyr', function (req, res) {
  var plname = req.body.upplayerlastname;
  var pfname = req.body.upplayerfirstname;
  var prewards = req.body.upplayerrewardspoints;
  var prtype = req.body.upplayermembertype;
  var pemail = req.body.upplayeremail;
  var pstat = req.body.upplayerstatus;
  var pid = req.body.upplayerid;
  if (prtype === 0 || prtype === 1) {
    if (pstat === 'Active' || pstat === 'Inactive') {
      var sqlins = "UPDATE players SET playerLastName = ?, playerFirstName = ?, playerStatus = ?, playerRewardsPoints = ?, playerMemberRewardsType = ?, playerEmail = ? WHERE playerID = ?";
      var inserts = [plname, pfname, pstat, prewards, prtype, pemail, pid];
      var sql = mysql.format(sqlins, inserts);
    }
    else {
      console.log("else", prtype);
      var sqlins = "UPDATE players SET playerLastName = ?, playerFirstName = ?, playerRewardsPoints = ?,  playerMemberRewardsType = ?, playerEmail = ? WHERE playerID = ?";
      var inserts = [plname, pfname, prewards, prtype, pemail, pid];
      var sql = mysql.format(sqlins, inserts);
    }
  }
  else {
    if (pstat === 'Active' || pstat === 'Inactive') {
      var sqlins = "UPDATE players SET playerLastName = ?, playerFirstName = ?, playerStatus = ?, playerRewardsPoints = ?, playerEmail = ? WHERE playerID = ?";
      var inserts = [plname, pfname, pstat, prewards, pemail, pid];
      var sql = mysql.format(sqlins, inserts);
    }
    else {
      var sqlins = "UPDATE players SET playerLastName = ?, playerFirstName = ?, playerRewardsPoints = ?, playerEmail = ? WHERE playerID = ?";
      var inserts = [plname, pfname, prewards, pemail, pid];
      var sql = mysql.format(sqlins, inserts);
    }
  }

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    console.log(sql);
    res.redirect('updateplayer.html');
    res.end();
  });
});
app.post('/editprofile', function (req, res) {
  var plname = req.body.upplayerlastname;
  var pfname = req.body.upplayerfirstname;
  var pemail = req.body.upplayeremail;
  var pid = req.body.upplayerid;
  var sqlins = "UPDATE players SET playerLastName = ?, playerFirstName = ?, playerEmail = ? WHERE playerID = ?";
  var inserts = [plname, pfname, pemail, pid];
  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    res.end();
  });
});
app.get('/getsingleplyr/', function (req, res) {
  var pid = req.query.upplyrid;

  var sqlsel = 'select * from players where playerID = ?'
  var inserts = [pid];
  var sql = mysql.format(sqlsel, inserts);
  console.log("Player retrieved.");
  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get('/getloggedinplayer/', function (req, res) {
  var pid = req.query.plyrid;

  var sqlsel = 'select * from players where playerID = ?'
  var inserts = [pid];
  var sql = mysql.format(sqlsel, inserts);
  console.log("Player retrieved.");
  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
app.get('/getplyr/', function (req, res) {
  var plname = req.query.playerlastname;
  var pfname = req.query.playerfirstname;
  var prtype = req.query.playermembertype;
  var prewards = req.query.playerrewardspoints;
  var pemail = req.query.playeremail;
  var pstat = req.query.playerstatus;

  console.log("Status: " + pstat);
  if (prtype == 0 || prtype == 1) {
    var typeaddon = ' and playerMemberRewardsType = ?';
    var typeaddonvar = prtype;
  } else {
    var typeaddon = ' and playerMemberRewardsType Like ?';
    var typeaddonvar = '%%';
  }
  if (pstat == 'Active' || pstat == 'Inactive') {
    var statusaddon = ' and playerStatus = ?';
    var statusaddonvar = pstat;
  } else {
    var statusaddon = ' and playerStatus Like ?';
    var statusaddonvar = '%%';
  }



  var sqlsel = 'Select * FROM players ' +
    ' where playerLastName Like ? and playerFirstName Like ? '
    + ' and playerRewardsPoints Like ? and playerEmail Like ?' + statusaddon + typeaddon;

  var inserts = [`%` + plname + `%`, `%` + pfname + `%`, `%` + prewards + `%`, `%` + pemail + `%`, statusaddonvar, typeaddonvar];

  var sql = mysql.format(sqlsel, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});

app.get('/getplyrinfo/', function (req, res) {
  // var plname = req.query.playerlastname;
  // var pfname = req.query.playerfirstname;
  // var pemail = req.query.playeremail;


  var sqlsel = 'Select * FROM players ';

  // var inserts = [`%` + plname + `%`, `%` + pfname + `%`, `%` + pemail + `%`];

  var sql = mysql.format(sqlsel);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});

app.get('/getemps/', function (req, res) {


  var sqlsel = 'select * from employee';
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get('/getplayers/', function (req, res) {
  var sqlsel = 'select * from players';
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get('/getinvs/', function (req, res) {
  var sqlsel = 'select * from inventory';
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
app.get('/getrez/', function (req, res) {
  var sqlsel = 'select * from reservations';
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
app.get('/getemptypes/', function (req, res) {

  var sqlsel = 'SELECT * FROM employeeTypes';
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});

app.get('/getsingleemp/', function (req, res) {

  var ekey = req.query.upempkey;

  var sqlsel = 'select * from employee where employeeID = ?';
  var inserts = [ekey];

  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.post('/updatesingleemp', function (req, res,) {

  var elname = req.body.upemployeelastname;
  var efname = req.body.upemployeefirstname;
  var eemail = req.body.upemployeeemail;
  var estatus = req.body.upemployeestatus;
  var etype = req.body.upemployeetype;
  var ekey = req.body.upemployeekey;
  if (estatus === 'Active' || estatus === 'Inactive') {
    var sqlins = "UPDATE employee SET employeeLastName = ?, employeeFirstName = ?, employeeEmail = ?, employeeStatus = ?, employeeTypeID =? WHERE employeeID = ? ";
    var inserts = [elname, efname, eemail, estatus, etype, ekey];
  } else {
    var sqlins = "UPDATE employee SET employeeLastName = ?, employeeFirstName = ?, employeeEmail = ?, employeeTypeID =? WHERE employeeID = ? ";
    var inserts = [elname, efname, eemail, etype, ekey];
  }


  var sql = mysql.format(sqlins, inserts);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    console.log(sql);
    res.end();
  });
});

app.get('/getemp/', function (req, res) {
  var eid = req.query.employeeid;
  var elname = req.query.employeelastname;
  var efname = req.query.employeefirstname;
  var eemail = req.query.employeeemail;
  var estatus = req.query.employeestatus;
  var etype = req.query.employeetype;

  console.log(estatus);

  if (estatus == 'Active' || estatus == 'Inactive') {
    var statusaddon = ' and employee.employeeStatus = ?';
    var statusaddonvar = estatus;
  } else {
    var statusaddon = ' and employee.employeeStatus Like ?';
    var statusaddonvar = '%%';
  }

  if (etype > 0) {
    var typeaddon = ' and employee.employeeTypeID = ?';
    var typeaddonvar = etype;
  } else {
    var typeaddon = ' and employee.employeeTypeID Like ?';
    var typeaddonvar = '%%';
  }

  var sqlsel = 'SELECT employee.*, employeeTypes.employeeTypeName from employee ' +
    'inner join employeeTypes on employeeTypes.employeeTypeID = employee.employeeTypeID ' +
    'where employee.employeeID LIKE ? and employee.employeeLastName LIKE ? and employee.employeeFirstName LIKE ?' +
    'and employee.employeeEmail LIKE ? '
    + statusaddon + typeaddon;

  var inserts = ['%' + eid + '%', '%' + elname + '%', '%' + efname + '%', '%' + eemail + '%', statusaddonvar, typeaddonvar];

  var sql = mysql.format(sqlsel, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});

app.post('/userCreatePlayer', function (req, res) {
  var plname = req.body.playerlastname;
  var pfname = req.body.playerfirstname;
  var pstatus = req.body.playerstatus;
  var prtype = req.body.playermembertype;
  var prewards = req.body.playerrewardspoints;
  var pmail = req.body.playeremail;
  // var ppw = req.body.playerpw;
  // console.log("PW: " + ppw);

  // var saltRounds = 10;
  // var theHashedPW = '';

  // bcrypt.hash(ppw, saltRounds, function (err, hashedPassword) {

  //   if (err) {
  //     console.log("Bad on encrypt");
  //     return;
  //   } else {

  //     theHashedPW = hashedPassword;
  //     console.log("Password Enc: " + theHashedPW);

  var sqlins = "INSERT INTO players (playerLastName, playerFirstName, playerStatus,"
    + " playerMemberRewardsType, playerRewardsPoints, playerEmail) VALUES (?, ?, ?, ?, ?, ?)";

  var inserts = [plname, pfname, pstatus, prtype, prewards, pmail];

  var sql = mysql.format(sqlins, inserts);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect('insertplayer.html');
    res.end();
  });
}
);

app.post('/playerCreateAccount', function (req, res) {
  var plname = req.body.playerlastname;
  var pfname = req.body.playerfirstname;
  var pstatus = "Active";
  var prewards = 0;
  var prtype = 0;
  var pmail = req.body.playeremail;
  var ppw = req.body.playerpw;
  console.log("PW: " + ppw);

  var saltRounds = 10;
  var theHashedPW = '';

  bcrypt.hash(ppw, saltRounds, function (err, hashedPassword) {

    if (err) {
      console.log("Bad on encrypt");
      res.status(500).json({ error: 'Bad on encrypt' });
      return;
    } else {

      theHashedPW = hashedPassword;
      console.log("Password Enc: " + theHashedPW);

      var sqlins = "INSERT INTO players (playerLastName, playerFirstName, playerStatus,"
        + " playerRewardsPoints, playerMemberRewardsType, playerEmail, playerPassword) VALUES (?, ?, ?, ?, ?, ?,? )";

      var inserts = [plname, pfname, pstatus, prewards, prtype, pmail, theHashedPW];

      var sql = mysql.format(sqlins, inserts);

      con.execute(sql, function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'Database error' });
          return;
        }
        console.log("1 record inserted");
        res.json({ success: true, redirectUrl: 'login.html' });
        res.end();
      });
    }
  });
});
app.post('/employee', function (req, res,) {

  var elname = req.body.employeelastname;
  var efname = req.body.employeefirstname;
  var eemail = req.body.employeeemail;
  var epw = req.body.employeepw;
  var estatus = req.body.employeestatus;
  var etype = req.body.employeetype

  console.log("PW: " + epw);

  var saltRounds = 10;
  var theHashedPW = '';

  bcrypt.hash(epw, saltRounds, function (err, hashedPassword) {

    if (err) {
      console.log("Bad on encrypt");
      return;
    } else {

      theHashedPW = hashedPassword;
      console.log("Password Enc: " + theHashedPW);

      var sqlins = "INSERT INTO employee ( employeeLastName, employeeFirstName, employeeEmail, " +
        " employeeStatus, employeeTypeID, employeePassword) " +
        " VALUES ( ?, ?, ?, ?, ?, ?)";

      var inserts = [elname, efname, eemail, estatus, etype, theHashedPW];

      var sql = mysql.format(sqlins, inserts);

      con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertemployee.html');
        res.end();
      });
    }
  });
});



app.post('/updatesingleres', function (req, res) {
  var rdatetime = req.body.upreservationdatetime;
  var rstatus = req.body.upreservationstatus;
  var rplay = req.body.upreservationplayer;
  var rid = req.body.upreservationid;
  var rplaycount = req.body.upreservationplayercount;
  var sqlins = "UPDATE reservations SET reservationDateTime = ?, reservationStatus = ?, playerID = ?, reservationPlayerCount = ? WHERE reservationID = ?";
  var inserts = [rdatetime, rstatus, rplay, rplaycount, rid];
  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
    res.end();
  });
});
app.post('/deleteRes', function (req, res) {
  var rid = req.body.upreservationid;
  var sqlins = "UPDATE reservations SET reservationEntryStatus = 'Inactive' WHERE reservationID = ?";
  var inserts = [rid];
  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted.");
    res.end();
  });
});
app.post('/deleteInv', function (req, res) {
  var iid = req.body.upinventoryid;
  var sqlins = "UPDATE inventory SET inventoryStatus = 'Inactive' WHERE inventoryID = ?";
  var inserts = [iid];
  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record deleted.");
    res.end();
  });
});
app.get('/getsingleres/', function (req, res) {
  var rid = req.query.upresid;

  var sqlsel = 'select * from reservations where reservationID = ?'
  var inserts = [rid];
  var sql = mysql.format(sqlsel, inserts);
  console.log("Reservation retrieved.");
  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (data && data[0] && data[0].reservationDateTime) {
      console.log("Raw Reservation DateTime: ", data[0].reservationDateTime.toISOString());
    }
    res.send(JSON.stringify(data));
  });
});

app.get('/getres/', function (req, res) {
  var rdatetime = req.query.reservationdatetime;
  var rstatus = req.query.reservationstatus;
  var rplay = req.query.reservationplayer;
  var rplaycount = req.query.reservationplayercount;

  console.log("Tier: " + rplay);



  if (rplay > 0) {
    var playaddon = ' and reservations.playerID = ?';
    var playaddonvar = rplay;
  } else {
    var playaddon = ' and reservations.playerID Like ?';
    var playaddonvar = '%%';
  }

  var sqlsel = " SELECT reservations.*, players.playerFirstName, players.playerLastName" +
    " FROM reservations INNER JOIN players ON players.playerID = reservations.playerID WHERE reservationDateTime LIKE ? AND reservationStatus LIKE ? and reservationPlayerCount LIKE ? and reservationEntryStatus = 'Active'" + playaddon;

  var inserts = [`%` + rdatetime + `%`, `%` + rstatus + `%`, `%` + rplaycount + `%`, playaddonvar];

  var sql = mysql.format(sqlsel, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});
app.get('/getdelres/', function (req, res) {
  console.log("Tier: " + rplay);
  var sqlsel = " SELECT reservations.*, players.playerFirstName, players.playerLastName" +
    " FROM reservations INNER JOIN players ON players.playerID = reservations.playerID WHERE reservationEntryStatus = 'Inactive'";
  var sql = mysql.format(sqlsel);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});
app.post('/reservation', function (req, res) {
  var rdatetime = req.body.reservationdatetime;
  var rstatus = req.body.reservationstatus;
  var rplay = req.body.reservationplayer;
  var rplaycount = req.body.reservationplayercount;

  var sqlins = "INSERT INTO reservations (reservationDateTime, reservationStatus, playerID, reservationPlayerCount) VALUES (?,?,?,?)";
  var inserts = [rdatetime, rstatus, rplay, rplaycount];
  var sql = mysql.format(sqlins, inserts);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log(sql);
    console.log("1 record inserted");
    res.json({ success: true, redirectUrl: 'Home.html' });
    res.end();
  });
});

app.get('/getReservedDateTime', (req, res) => {
  var sqlsel = "SELECT reservationDateTime FROM reservations WHERE reservationStatus = 'Scheduled' OR reservationStatus = 'Rescheduled'";
  var sql = mysql.format(sqlsel)
  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});
app.post('/updatesingleord', function (req, res) {
  var odate = req.body.uporderdate;
  var ototal = req.body.upordertotal;
  var odid = req.body.uporderdetailid;
  var odrid = req.body.upreservationid;
  var odiid = req.body.upinventoryid;
  var odprice = req.body.uporderdetailprice;
  var odqty = req.body.uporderdetailquantity;
  var oeid = req.body.upemployeeid;
  var oid = req.body.uporderid;
  var sqlInsOrder = "UPDATE orders SET employeeID = ?, orderTotal = ?, orderDate = ? WHERE orderID = ?";
  var insOrder = [oeid, ototal, odate, oid];
  var sqlOrder = mysql.format(sqlInsOrder, insOrder);
  var sqlInsDetail = "UPDATE orderDetail SET inventoryID = ?, reservationID = ?, orderDetailQuantity = ?, orderDetailPrice = ? WHERE orderDetailID = ?";
  var insDetail = [odiid, odrid, odqty, odprice, odid];
  var sqlDetail = mysql.format(sqlInsDetail, insDetail);

  console.log(sqlOrder, sqlDetail);
  con.execute(sqlOrder, function (err) {
    if (err) throw err;
    console.log("Order updated");
    con.execute(sqlDetail, function (err) {
      if (err) throw err;
      console.log("Order Detail updated");
      res.end();
    });
  });
});
app.post('/deleteOrd', function (req, res) {
  var oid = req.body.uporderid;
  var odid = req.body.uporderdetailid;
  var sqlInsOrder = "UPDATE orders SET orderStatus = 'Inactive' WHERE orderID = ?";
  var insOrder = [oid];
  var sqlOrder = mysql.format(sqlInsOrder, insOrder);
  var sqlInsDetail = "UPDATE orderDetail SET orderDetailStatus = 'Inactive' WHERE orderDetailID = ?";
  var insDetail = [odid];
  var sqlDetail = mysql.format(sqlInsDetail, insDetail);
  console.log(sqlOrder, sqlDetail);
  con.execute(sqlOrder, function (err) {
    if (err) throw err;
    console.log("Order deleted");
    con.execute(sqlDetail, function (err) {
      if (err) throw err;
      console.log("Order Detail deleted");
      res.end();
    });
  });
});
app.get('/getsingleord/', function (req, res) {
  var oid = req.query.upordid;
  var odid = req.query.upordid;

  var sqlsel = 'select * from orders, orderDetail where orders.orderID = ? AND orderDetail.orderID = ?'
  var inserts = [oid, odid];
  var sql = mysql.format(sqlsel, inserts);
  console.log("Single order retrieved.");
  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(data)
    res.send(JSON.stringify(data));
  });
});

app.get('/getord/', function (req, res) {
  var odate = req.query.orderdate;
  var ototal = req.query.ordertotal;
  var odid = req.query.orderdetailid;
  var odrid = req.query.reservationid;
  var odiid = req.query.inventoryid;
  var odqty = req.query.orderdetailquantity;
  var oeid = req.query.employeeid;

  var sql = `SELECT o.orderID, o.orderDate, o.orderTotal, e.employeeLastName, e.employeeFirstName,
       od.orderDetailID, od.orderDetailQuantity, od.orderDetailPrice,
       i.inventoryName, r.reservationID
FROM orders o
INNER JOIN employee e ON e.employeeID = o.employeeID
LEFT JOIN orderDetail od ON od.orderID = o.orderID
LEFT JOIN inventory i ON i.inventoryID = od.inventoryID
LEFT JOIN reservations r ON r.reservationID = od.reservationID
WHERE o.orderStatus = 'Active' AND od.orderDetailStatus = 'Active' AND
(COALESCE(?, '') = '' OR o.orderDate LIKE CONCAT('%', ?, '%')) AND
      (COALESCE(?, '') = '' OR CAST(o.orderTotal AS CHAR) LIKE CONCAT('%', ?, '%')) AND
      (COALESCE(?, '') = '' OR CAST(od.orderDetailID AS CHAR) LIKE CONCAT('%', ?, '%')) AND
      (COALESCE(?, '') = '' OR CAST(r.reservationID AS CHAR) LIKE CONCAT('%', ?, '%')) AND
      (COALESCE(?, '') = '' OR CAST(i.inventoryID AS CHAR) LIKE CONCAT('%', ?, '%')) AND
      (COALESCE(?, '') = '' OR CAST(od.orderDetailQuantity AS CHAR) LIKE CONCAT('%', ?, '%')) AND
      (COALESCE(?, '') = '' OR CAST(e.employeeID AS CHAR) LIKE CONCAT('%', ?, '%'));
`;

  var inserts = [
    odate, odate,
    ototal, ototal,
    odid, odid,
    odrid, odrid,
    odiid, odiid,
    odqty, odqty,
    oeid, oeid
  ];

  var sql = mysql.format(sql, inserts);

  console.log(sql);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});

app.post('/order', function (req, res) {
  var odate = req.body.orderdate;
  var ototal = req.body.ordertotal;
  var odid = req.body.orderdetailid;
  var odrid = req.body.reservationid || null;
  var odiid = req.body.inventoryid || null;
  var odprice = req.body.orderdetailprice || null;
  var odqty = req.body.orderdetailquantity || null;
  var oeid = req.body.employeeid;
  console.log(odate + "-" + ototal + "-" + odid);
  var sqlInsOrder = "INSERT INTO orders (employeeID, orderTotal, orderDate) VALUES (?, ?, now())";
  var insertOrder = [oeid, ototal, odate];
  var sqlOrder = mysql.format(sqlInsOrder, insertOrder);

  con.query(sqlOrder, function (err, result) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("1 order record inserted");
    var orderID = result.insertId;
    var sqlInsOrderDetail = "INSERT INTO orderDetail (orderID, inventoryID, reservationID, orderDetailQuantity, orderDetailPrice) VALUES (?, ?, ?, ?, ?)";
    var insertOrderDetail = [orderID, odiid, odrid, odqty, odprice];
    var sqlOrderDetail = mysql.format(sqlInsOrderDetail, insertOrderDetail);

    con.query(sqlOrderDetail, function (err, result) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log("1 orderDetail record inserted");
      // res.redirect('insertorder.html');
    });
  });
});



// app.post('/Cart/', function (req, res) {

//   var cartemp = req.body.CartEmp;
//   var cartcust = req.body.CartCust;

//   var sqlsel = 'select MAX(dbcartdailyid) as daymax from cartinfo '
//     + ' WHERE DATE(dbcartdate) = CURDATE()';

//   var sql = mysql.format(sqlsel);

//   var dailynumber = 1;

//   con.query(sql, function (err, data) {
//     console.log(data[0].daymax);

//     if (!data[0].daymax) {
//       dailynumber = 1;
//     } else {
//       dailynumber = data[0].daymax + 1;
//     }

//     var sqlinscart = "INSERT INTO cartinfo (dbcartemp, dbcartcust, dbcartdailyid, "
//       + "  dbcartpickup, dbcartmade, dbcartdate) VALUES (?, ?, ?, ?, ?, now())";
//     var insertscart = [cartemp, cartcust, dailynumber, 0, 0];

//     var sqlcart = mysql.format(sqlinscart, insertscart);

//     con.execute(sqlcart, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//       res.redirect('insertcart.html');
//       res.end();
//     });
//   });
// });

// app.get('/getcart/', function (req, res) {

//   var empid = req.query.employeeid;

//   if (empid == 0) {
//     var sqlsel = 'Select cartinfo.*, employee.employeeLastName,  employee.employeeFirstName, players.playerLastName from cartinfo' +
//       ' inner join employee on employee.employeeID = cartinfo.dbcartemp' +
//       ' inner join players on players.playerID = cartinfo.dbcartcust' +
//       ' ORDER by employee.employeeLastName';
//     var sql = mysql.format(sqlsel);
//   }
//   else {
//     var sqlsel = 'Select cartinfo.*, employee.employeeLastName,  employee.employeeFirstName, players.playerLastName from cartinfo' +
//       ' inner join employee on employee.employeeID = cartinfo.dbcartemp' +
//       ' inner join players on players.playerID = cartinfo.dbcartcust' +
//       ' where dbcartemp = ? ';
//     var inserts = [empid];
//     var sql = mysql.format(sqlsel, inserts);
//   }

//   console.log(sql);

//   con.query(sql, function (err, data) {
//     if (err) {
//       console.error(err);
//       process.exit(1);
//     }
//     res.send(JSON.stringify(data));
//   });
// });

// app.get('/getcartbydate/', function (req, res) {

//   var startingdate = req.query.datestart;
//   var endingdate = req.query.dateend;
//   var empid = req.query.employeeid;
//   if (empid == 0) {
//     var sqlsel = 'Select cartinfo.*, employee.employeeLastName,  employee.employeeFirstName, players.playerLastName from cartinfo' +
//       ' inner join employee on employee.employeeID = cartinfo.dbcartemp' +
//       ' inner join players on players.playerID = cartinfo.dbcartcust' +
//       ' where dbcartdate > ? AND dbcartdate < ?' +
//       ' ORDER BY dbcartdate';
//     var inserts = [startingdate, endingdate];
//     var sql = mysql.format(sqlsel, inserts);
//   }
//   else {
//     var sqlsel = 'Select cartinfo.*, employee.employeeLastName,  employee.employeeFirstName, players.playerLastName from cartinfo' +
//       ' inner join employee on employee.employeeID = cartinfo.dbcartemp' +
//       ' inner join players on players.playerID = cartinfo.dbcartcust' +
//       ' where dbcartdate > ? AND dbcartdate < ? AND dbcartemp = ? ' +
//       ' ORDER BY dbcartdate';

//     var inserts = [startingdate, endingdate, empid];
//     var sql = mysql.format(sqlsel, inserts);
//   }


//   console.log(sql);

//   con.query(sql, function (err, data) {
//     if (err) {
//       console.error(err);
//       process.exit(1);
//     }
//     res.send(JSON.stringify(data));
//   });
// });


app.listen(app.get('port'), function () {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
