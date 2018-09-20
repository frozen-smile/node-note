exports.getMimeForFs = function(fs,extname){  /*使用同步读取文件 获取后缀名的方法*/

    //把读取数据改成同步
    var data=fs.readFileSync('../json/mime.json');
    //data.toString() 转换成json字符串
    var Mimes=JSON.parse(data.toString());  /*把json字符串转换成json对象*/
    return Mimes[extname] || 'text/html';

}

exports.getMimeForEventEmitter = function(fs,EventEmitter,extname){  /*使用事件广播 获取后缀名的方法*/
    fs.readFile('../json/mime.json',function (err,data) {
        if (err) {
            console.log(err);
            return false;
        }
        var Mimes = JSON.parse(data.toString());
        var result = Mimes[extname] || 'text/html';
        EventEmitter.emit('getmime',result);
    })
}