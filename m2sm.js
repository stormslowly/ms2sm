"use strict";

var mysql = require("mysql");
var m2smlib = require("./lib/mysql2SailsModel.js");

var m2sm = require("commander");



m2sm.version('0.0.1')
  .option('-h, --host [host addr]', 'Specify mysql host,default is localhost',
    'localhost')
  .option('-d, --database <database name>', 'Specify database name')
  .option('-t, --table <table>' , 'Specify table name')
  .option('-u, --user [user name]', 'Specify user name defualt is root','roots')
  .option('-p, --password [password]', 'Specify password defualt empty','')
  .parse(process.argv);

if( !m2sm.database ){
  console.error("database name must be specifid");
  process.exit();
}

if( !m2sm.table ) {
  console.log("table name must be specifid");
  process.exit();
}

var mysqlConfig = {
  host: m2sm.host,
  user: m2sm.user,
  password: m2sm.password,
  database: m2sm.database,
  pool: true,
  connectionLimit: 10,
  waitForConnections: true
};

var connection = mysql.createConnection( mysqlConfig );

function __DESCRIBE__(err, schema) {
  if (err) {
    console.error(err);
    connection.end();
    return;

  }

  var sailsModel = m2smlib.convertSchema2SailsModel(schema);
  sailsModel.tableName = m2sm.table;

  console.log(sailsModel);
  connection.end();
}

connection.connect(function(err) {

  if(err) {
    console.error("connect to mysql failed ",err);
  }

  connection.query("DESCRIBE " + m2sm.table + " ;",__DESCRIBE__);

});
