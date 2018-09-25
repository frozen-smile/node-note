
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var events = require('events');
var eventsEmitter = new events.EventEmitter();

var mimeModel = require('./getMime.js');



http.createServer(function (req,res) {

    var pathname = url.parse(req.url).pathname;
    // console.log(pathname);

    if (pathname=='/'){
        pathname = 'index.html';
    }

    //获取文件的后缀名
    var extname=path.extname(pathname);

    // console.log(extname);

    if(pathname!='/favicon.ico'){  /*过滤请求favicon.ico*/
        //console.log(pathname);
        //文件操作获取 static下面的index.html

        if (extname == ''){
            pathname += '.html';
        }
        fs.readFile('../static/'+pathname,function(err,data){
            if(err){  /*么有这个文件*/
                console.log('404');
                fs.readFile('../static/404.html',function(error,data404){
                    if(error){
                        console.log(error);
                    }
                    res.writeHead(404,{"Content-Type":"text/html;charset='utf-8'"});
                    res.write(data404);
                    res.end(); /*结束响应*/
                })
            }else{ /*返回这个文件*/

                var mime = mimeModel.getMimeForFs(fs,extname,function (mime) {
                    res.writeHead(200,{"Content-Type":""+mime+";charset='utf-8'"});
                    res.write(data);
                    res.end();
                });

                // var mime = mimeModel.getMimeForFsSync(fs,extname);
                // res.writeHead(200,{"Content-Type":""+mime+";charset='utf-8'"});
                // res.write(data);
                // res.end();

                // var mime = mimeModel.getMimeForEventEmitter(fs,eventsEmitter,extname);
                // eventsEmitter.on('getmime',function (mime) {
                //     res.writeHead(200,{"Content-Type":""+mime+";charset='utf-8'"});
                //     //不用res.write(data); 而是直接在结束时传回数据，否者会报错 write after end
                //     res.end(data);
                // })
            }
        })
    }
}).listen(8002);