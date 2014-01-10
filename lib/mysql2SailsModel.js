"use strict";

var _defualtModel = { 
  schema: true,
  attributes:{} 
};


var _clone = function (a) {
  return JSON.parse(JSON.stringify(a));
};

var _isStartWith = function(str,expect){
  return str.substr(0,expect.length) === expect;
};

 
module.exports = {
  "convertSchema2SailsModel": function(schema){
    var model = _clone(_defualtModel);
    var attributes = model.attributes;
    var schemaLength = schema.length;
    

    for(var i=0;i<schemaLength;i++){
      var typeOfSchema = schema[i].Type;
      var fieldOfSchema = schema[i].Field;

      if(fieldOfSchema==="createdAt" || fieldOfSchema ==="updatedAt"){
        continue;
      }

      attributes[schema[i].Field] = {};

      if( _isStartWith(typeOfSchema,"varchar") ){
        attributes[schema[i].Field].type = "string";  
      }else{
        attributes[schema[i].Field].type = "integer";
      }
      
    }


    // console.log(model);
    return model;
  }


};