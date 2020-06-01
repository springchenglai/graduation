var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  database: 'cloudmusic',
  user: 'lailai',
  password: 'cheng1996'
})
connection.connect(function(error){
  if(error){
    console.error('error connectiong:' + error.stack)
    return
  }
  console.log('connected as id' + connection.threadId)
})
module.exports = connection