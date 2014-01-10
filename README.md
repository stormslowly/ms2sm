# M2MS
### a simple tool to convert mysql Schema to sails model json file
Just hate to write the model json by hand so write this
##Options 

```
$ node m2sm.js --help
  Usage: m2sm.js [options]
  Options:
    -h, --help                      output usage information
    -V, --version                   output the version number
    -h, --host [host addr]          Specify mysql host,default is localhost
    -d, --database [database name]  Specify database name
    -t, --table [table]             Specify table name
    -u, --user [user name]          Specify user name defualt is root
    -p, --password [password]       Specify password defualt empty
```

##Example

```
mysql> desc bus_vehicles;
+----------------+------------------+------+-----+---------+-------+
| Field          | Type             | Null | Key | Default | Extra |
+----------------+------------------+------+-----+---------+-------+
| Vehicle_ID     | int(20) unsigned | NO   | PRI | NULL    |       |
| License_Number | varchar(32)      | YES  |     | NULL    |       |
| Device_ID      | varchar(64)      | YES  |     | NULL    |       |
| Route_Name     | varchar(64)      | YES  |     | NULL    |       |
| createdAt      | datetime         | YES  |     | NULL    |       |
| updatedAt      | datetime         | YES  |     | NULL    |       |
+----------------+------------------+------+-----+---------+-------+
6 rows in set (0.04 sec)
```
we will get the sails model json like below
```
$ node m2sm --database db_name --table bus_vehicles -u yourname -p secret
```
then 
```
{ schema: true,
  attributes:
   { Vehicle_ID: { type: 'integer' },
     License_Number: { type: 'string' },
     Device_ID: { type: 'string' },
     Route_Name: { type: 'string' } },
  tableName: 'bus_vehicles' }
```


##Bugs
It just fit my requirement.
If shit happens, leave me a issue or pull request your code 

