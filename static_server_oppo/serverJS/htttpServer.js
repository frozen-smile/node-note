
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var mimeModel = require('./getMime.js');



http.createServer(function (req,res) {

    var pathname = url.parse(req.url).pathname;
    console.log(pathname);

    if (pathname=='/'){
        pathname = 'index.html';
    }

    //获取文件的后缀名
    var extname=path.extname(pathname);

    console.log(extname);

    if(pathname!='/favicon.ico'){  /*过滤请求favicon.ico*/
        //console.log(pathname);
        //文件操作获取 static下面的index.html

        if (extname == ''){
            pathname += '.html';
        }
        fs.readFile('../'+pathname,function(err,data){
            if(err){  /*么有这个文件*/
                console.log('404');
                fs.readFile('../404.html',function(error,data404){
                    if(error){
                        console.log(error);
                    }
                    res.writeHead(404,{"Content-Type":"text/html;charset='utf-8'"});
                    res.write(data404);
                    res.end(); /*结束响应*/
                })
            }else{ /*返回这个文件*/
                var mime=mimeModel.getMime(fs,extname);  /*获取文件类型*/
                res.writeHead(200,{"Content-Type":""+mime+";charset='utf-8'"});
                res.write(data);
                res.end(); /*结束响应*/
            }
        })
    }
}).listen(8002);