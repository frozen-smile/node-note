var express = require('express');

var app = express();

app.use('/',express.static('../static'));

app.listen(3000,function (err) {
    if (err){
        throw err
    }
    console.log('start success!\nExample app listening on port 3000!');
})