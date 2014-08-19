"use strict";

var inflection = require('inflection');

var _defaultModel = {
  schema: true,
  attributes:{}
};


var _clone = function (a) {
  return JSON.parse(JSON.stringify(a));
};

var _isStartWith = function(str,expect){
  return str.substr(0,expect.length) === expect;
};

var _getFieldSize = function(fieldType) {
  return parseInt(fieldType.match(/\d+/)[0]);
};

var _getEnumArray = function(fieldType) {
  var obj = fieldType.match(/[^\(\)]+/g);
  return obj[1].replace(/\'/g,'').split(',');
};

module.exports = {
  "convertSchema2SailsModel": function(schema){
    var model = _clone(_defaultModel);
    var attributes = model.attributes;
    var schemaLength = schema.length;


    for(var i=0;i<schemaLength;i++){
      var typeOfSchema = schema[i].Type;
      var fieldOfSchema = schema[i].Field;
      var extraOfSchema = schema[i].Extra;
      var fieldDefaultValue = schema[i].Default;

      // Determine if the field is required by the null setting.
      var fieldRequired = (schema[i].Null == 'NO') ;

      // Set the field name to fieldName instead of field_name
      var camelizedField = inflection.camelize(fieldOfSchema, true);
      var _schema = schema[i];


      if(fieldOfSchema==="createdAt" || fieldOfSchema ==="updatedAt"){
        continue;
      }

      attributes[camelizedField] = {};

      // If the camelized field doesn't match the tablename, add to model.
      if(camelizedField !== fieldOfSchema) {
        attributes[camelizedField].columnName = fieldOfSchema;
      }

      if(fieldRequired) {
        attributes[camelizedField].required = fieldRequired;
      }

      if(fieldDefaultValue) {
        attributes[camelizedField].defaultsTo = fieldDefaultValue;
      }

      if( _isStartWith(typeOfSchema,"varchar") ||
          _isStartWith(typeOfSchema,"char")) {
        attributes[camelizedField].type = "string";
        attributes[camelizedField].size = _getFieldSize(typeOfSchema);

      } else if( _isStartWith(typeOfSchema,"timestamp") ||
                 _isStartWith(typeOfSchema,"datetime") ) {
        attributes[camelizedField].type = "datetime";

      } else if( _isStartWith(typeOfSchema,"date") ) {
        attributes[camelizedField].type = "date";

      } else if( _isStartWith(typeOfSchema,"time") ) {
        attributes[camelizedField].type = "string";

      } else if( _isStartWith(typeOfSchema,"enum") ) {
        attributes[camelizedField].type = "string";
        attributes[camelizedField].enum = _getEnumArray(typeOfSchema);

      } else if( _isStartWith(typeOfSchema,"decimal") ) {
        attributes[camelizedField].type = "float";

      } else {
        attributes[camelizedField].type = "integer";
        if(extraOfSchema === "auto_increment")
          attributes[camelizedField].autoIncrement = true;
      }

      if( _schema.Key === "PRI"){
        attributes[camelizedField].primaryKey = true;
      }

    }

    return model;
  }


};
