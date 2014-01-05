"use strict";


var sql = require("./sql.js");
var mysql = require("mysql");

function __DESCRIBE__(err, schema) {
  if (err) {
    console.log(err);
    connection.end();
    return;
    
  }

  // Convert mysql format to standard javascript object
  var normalizedSchema = sql.normalizeSchema(schema);

  // Set Internal Schema Mapping
  // dbs[collectionName].schema = normalizedSchema;

  // TODO: check that what was returned actually matches the cache
  // cb(null, normalizedSchema);
  console.log(normalizedSchema);
  connection.end();
}


var argvs = process.argv.slice(2);
var argc = argvs.length;

if (argc !== 1 ){
  console.error("plz give me the table name");
  process.exit();
}

var mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
  pool: true,
  connectionLimit: 10,
  waitForConnections: true
};

function marshalConfig(config) {
  return {
    host: config.host,
    port: config.port || 3306,
    socketPath: config.socketPath || null,
    user: config.user,
    password: config.password,
    database: config.database
  };
}


var connection = mysql.createConnection( marshalConfig( mysqlConfig ) );

connection.connect(function(err) {
  
  if(err) {
    console.error("connect to mysql failed ",err);
  }
   
  connection.query("DESCRIBE " + argvs[0] + " ;",__DESCRIBE__);

});