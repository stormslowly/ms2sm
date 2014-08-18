"use strict";

var mysql = require("mysql");
var fs = require("fs");
var m2smlib = require("./lib/mysql2SailsModel.js");
var inflection = require('inflection');

var m2sm = require("commander");

m2sm.version('0.0.1')
  .option('-h, --host [host addr]', 'Specify mysql host,default is localhost',
    'localhost')
  .option('-d, --database <database name>', 'Specify database name')
  .option('-t, --table [table]' , 'Specify table name ignore for all tables')
  .option('-u, --user [user name]', 'Specify user name defualt is root','root')
  .option('-p, --password [password]', 'Specify password defualt empty','')
  .parse(process.argv);

if( !m2sm.database ){
  console.error("database name must be specifid");
  process.exit();
}

if( !m2sm.table) {
  console.log("table not specified, all tables selected.");
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

function writeModel(schema, table) {
  if(!schema) {
    // This can cause problems if a view references invalid tables.
    return;
  }

  var sailsModel = m2smlib.convertSchema2SailsModel(schema);

  sailsModel.tableName = table;
  var camelTableName = inflection.camelize(table, true);

  var modelPrefix = "/**\n* "+camelTableName+".js\n*\n* @description :: TODO: Write a short summary of how this model works and what it represents here.\n* @docs        :: http://sailsjs.org/#!documentation/models\n*/\n\nmodule.exports = ";

  fs.writeFile(camelTableName + '.js', //filename
    modelPrefix+JSON.stringify(sailsModel, undefined, 2), //text
    function (err) {
      if (err)
        throw err;

      console.log(camelTableName + ' Model created.');
  });

  if(m2sm.table) {
    connection.end();
  }
}

function __SHOW_TABLES__(err, tables) {
  if (err) {
    console.error(err);
    connection.end();
    return;
  }

  for(var i = 0, j = tables.length; i < j; i++) {
    var currentTable = tables[i]['Tables_in_'+m2sm.database];
    (function(table) {
      console.log(table);
      connection.query("DESCRIBE `" + table + "`;", function(err, schema) {
        writeModel(schema, table);
      });
    })(currentTable);
  }

  connection.end();
}

connection.connect(function(err) {
  if(err) {
    console.error("connect to mysql failed ",err);
  }

  if(!m2sm.table) {
    connection.query("SHOW TABLES;",__SHOW_TABLES__);
  } else {
    connection.query("DESCRIBE " + m2sm.table + ";", function(err, schema) {
      writeModel(schema, m2sm.table);
    });
  }
});
