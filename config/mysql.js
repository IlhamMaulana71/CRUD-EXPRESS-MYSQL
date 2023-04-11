const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'karatsoe71',
    database:'eduwork-cruds'
});

module.exports = connection;