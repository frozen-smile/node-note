
var http = require('http');
// var fs = require('fs');
// var path = require('path');
// var url = require('url');

var staticServe = require('./staticServe');






http.createServer(function (req,res) {

    staticServe.creatStaticServe(req,res,'../static/');

}).listen(8002);