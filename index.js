"use strict";


var sql = require("./sql.js");
var mysql = require("mysql");






var tableName = 'bus_vehicles';
var pkQuery = "SHOW INDEX FROM " + tableName + ";";

function __DESCRIBE__(err, schema, cb) {
    if (err) {
      console.log(err);
      connection.end();
      return;
      
    }

    connection.query(pkQuery, function(err, pkResult) {
      if(err){
        return cb(err);
      } 

      // Loop through Schema and attach extra attributes
      schema.forEach(function(attr) {

        // Set Primary Key Attribute
        if(attr.Key === 'PRI') {
          attr.primaryKey = true;

          // If also an integer set auto increment attribute
          if(attr.Type === 'int(11)') {
            attr.autoIncrement = true;
          }
        }

        // Set Unique Attribute
        if(attr.Key === 'UNI') {
          attr.unique = true;
        }
      });

      // Loop Through Indexes and Add Properties
      pkResult.forEach(function(result) {
        schema.forEach(function(attr) {
          if( attr.Field !== result.Column_name){ 
            return;
          }
          attr.indexed = true;
        });
      });

      // Convert mysql format to standard javascript object
      var normalizedSchema = sql.normalizeSchema(schema);

      // Set Internal Schema Mapping
      // dbs[collectionName].schema = normalizedSchema;

      // TODO: check that what was returned actually matches the cache
      // cb(null, normalizedSchema);
      console.log(normalizedSchema);
      connection.end();
    });

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