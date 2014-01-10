"use strict";
var M2SM = require("../lib/mysql2SailsModel.js");
var expect = require("chai").expect;

describe("Convert MySQL Schema to Sails Model",function(){

  var model;
  function invoke(schema){
    model = M2SM.convertSchema2SailsModel(schema);
  }


  it("should return a object", function(){
    var model = M2SM.convertSchema2SailsModel([]);
    expect(model).is.a.instanceof(Object);
    expect(model).to.include.key("attributes");
  }); 

  it("should insert all field to the model",function(){
    var schema = [ { Field: 'field1',
                    Type: 'int(20) unsigned',
                    Null: 'NO',
                    Key: 'PRI',
                    Default: null,
                    Extra: '' },
                  { Field: 'field2',
                    Type: 'varchar(32)',
                    Null: 'YES',
                    Key: '',
                    Default: null,
                    Extra: '' },
                  { Field: 'field3',
                    Type: 'varchar(64)',
                    Null: 'YES',
                    Key: '',
                    Default: null,
                    Extra: '' } ];
    invoke(schema);

    expect(model.attributes).to.include.keys(["field1","field2","field1"]);
 
  });

  it("should coenvert int to integer type", function(){
    var schema = [{ Field: 'field1',
                    Type: 'int(20) unsigned',
                    Null: 'NO',
                    Key: 'PRI',
                    Default: null,
                    Extra: '' } ];
    var model = M2SM.convertSchema2SailsModel(schema);
    expect(model.attributes.field1).to.include.key("type");
    expect(model.attributes.field1.type).to.equal("integer");

  });

  it("should convert varchar to string type",function (){
    var schema = [{ Field: 'field1',
                    Type: 'varchar(32)',
                    Null: 'YES',
                    Key: '',
                    Default: null,
                    Extra: '' }, ];

    invoke(schema);
    expect(model.attributes.field1).to.include.key("type");
    expect(model.attributes.field1.type).to.equal("string");

  });


  it("should omitted createdAt and updatedAt field", function(){
    var schema = [{ Field: 'createdAt',
                    Type: 'datetime',
                    Null: 'YES',
                    Key: '',
                    Default: null,
                    Extra: '' },
                  { Field: 'updatedAt',
                    Type: 'datetime',
                    Null: 'YES',
                    Key: '',
                    Default: null,
                    Extra: '' } ];
    
    invoke(schema);
    
    expect(model.attributes).to.be.empty;

  });


  it("should find the primary key of schem",function(){
    var schema = [ { Field: 'field1',
                     Type: 'int(20) unsigned',
                     Null: 'NO',
                     Key: 'PRI',
                     Default: null,
                     Extra: '' },
                   { Field: 'field2',
                     Type: 'int(20) unsigned',
                     Null: 'NO',
                     Default: null,
                     Extra: '' } ];
    invoke(schema);
    console.log(model);
    expect(model.attributes.field1.primKey).to.be.ok;
    expect(model.attributes.field2.primKey).to.be.not.ok;
  });

});