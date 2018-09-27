
var http = require('http');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var url = require('url');


var backendData = {
    indexTiele:"此处是后台模板渲染的数据",
    indexInfo: "<h2>此处是后台模板渲染的HTML </h2>",
    indexList:["data1","data2","data3"],
    loginTitle: "登录页面",
}


http.createServer(function (req,res) {

    res.writeHead(200,{"Content-Type":"text/html;charset:'utf-8'"});

    var pathname = url.parse(req.url).pathname;
    var method = req.method.toLowerCase();

    if (pathname!='/favicon.ico'){
        if (pathname=='/'){
            ejs.renderFile('./view/index.ejs',{
                indexInfo: backendData.indexInfo,
                indexTiele:backendData.indexTiele,
                indexList:backendData.indexList
            }, function (err,data) {
                console.log(err)
                res.end(data);
            })
        }else if (pathname=='/login'){
            ejs.renderFile('./view/login.ejs',{
                title:backendData.loginTitle
            }, function (err,data) {
                res.end(data);
            })
        }else if (pathname=='/dologin' && method=="get"){
            var search = url.parse(req.url,true).query;
            console.log(search);
            res.end('success');
        }else if (pathname=='/dologin' && method=="post"){
            var postStr = "";

            req.on("data",function (chunk) {
                postStr += chunk;
            })
            req.on('end',function (err) {
                console.log(postStr);
                fs.appendFile('login.txt',postStr+'\n',function (error) {
                    if (error) console.log(error);
                })
                res.end('<script>alert("success");</script>');
            });
        }
    }




}).listen(8002);