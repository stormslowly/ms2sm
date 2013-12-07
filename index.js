"use strict";


var mysql = require("mysql");
var sql = require("./sql.js")


var mysql_config ={
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

var tableName = 'bus_routes';
var query = 'DESCRIBE ' + tableName;
var pkQuery = "SHOW INDEX FROM " + tableName + ";";

function __DESCRIBE__(err, schema) {
    if (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return cb();
      } else return cb(err);
    }

    connection.query(pkQuery, function(err, pkResult) {
      if(err) return cb(err);

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
          if(attr.Field !== result.Column_name) return;
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

var connection = mysql.createConnection(marshalConfig(mysql_config));

connection.connect(function(err) {
  if(err) console.error("connect to mysql failed ",err);
  console.log("connect");
   
  connection.query("DESCRIBE bus_routes;",__DESCRIBE__);

});