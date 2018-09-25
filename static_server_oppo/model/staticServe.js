
var fs = require('fs');
var path = require('path');
var url = require('url');

function getMimeForFs (extname){
    var data=fs.readFileSync('../json/mime.json');
    var Mimes=JSON.parse(data.toString());
    return Mimes[extname] || 'text/html';
}



exports.creatStaticServe = function (req,res,static) {
    var pathname = url.parse(req.url).pathname;

    if (pathname=='/'){
        pathname = 'index.html';
    }
    //获取文件的后缀名
    var extname=path.extname(pathname);

    if(pathname!='/favicon.ico'){  /*过滤请求favicon.ico*/

        if (extname == ''){
            pathname += '.html';
        }
        fs.readFile(static + pathname,function(err,data){
            if(err){  /*么有这个文件*/
                console.log('404');
                fs.readFile(static + '404.html',function(error,data404){
                    if(error){
                        console.log(error);
                    }
                    res.writeHead(404,{"Content-Type":"text/html;charset='utf-8'"});
                    res.write(data404);
                    res.end(); /*结束响应*/
                })
            }else{
                /*获取文件类型*/
                var mime = getMimeForFs(extname);
                res.writeHead(200,{"Content-Type":""+mime+";charset='utf-8'"});
                res.write(data);
                res.end();
            }
        })
    }
}