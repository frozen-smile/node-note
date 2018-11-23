var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    port: '3306',
    database : 'test'
});

connection.connect(function (err) {
    if (err){
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('数据库连接成功');
    // console.log(connection);
    // console.log(connection.threadId);
})

var sql = 'SELECT * FROM websites';

connection.query(sql,function (err, result) {
    if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
});

connection.end();