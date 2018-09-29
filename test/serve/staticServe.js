
var fs = require('fs');
var path = require('path');
var url = require('url');

function getMimeForFs (extname){
    var readAddress = path.join(__dirname,"../json/mime.json");
    var data=fs.readFileSync(readAddress);
    var Mimes=JSON.parse(data.toString());
    return Mimes[extname] || 'text/html';
}



exports.creatStaticServe = function (req,res,static) {
    var pathname = url.parse(req.url).pathname;

    //获取文件的后缀名
    var extname=path.extname(pathname);

    if(pathname!='/favicon.ico' && extname){  /*过滤请求favicon.ico*/
        var readAddress = path.join(__dirname,static + pathname);
        fs.readFile(readAddress,function(err,data){
            if(err){  /*么有这个文件*/
                console.log('404');
                res.writeHead(404,{"Content-Type":"text/html;charset='utf-8'"});
                res.end();
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