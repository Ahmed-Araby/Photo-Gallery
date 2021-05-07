var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'ahmed',
  password        : '2357',
  database        : 'image_gallery'
});
 

/*
// for testing
// it will connect by defailt
pool.query('select * from roles;', function (error, results, fields) {
  if (error) throw error;
  console.log('res is : ', results);
  pool.end();
});*/
module.exports = {"mySqlPool":pool, mysql};
