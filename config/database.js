const mysql = require('mysql')

const connection= mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"h2o1992$",
    database:"image_upload"


})
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = connection;
