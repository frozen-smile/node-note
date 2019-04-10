var request = require('sync-request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


var resData;
var results = undefined;

var rnd = rand16 ();
var url = 'https://emap.pcsc.com.tw/ecmap/byAreaData.aspx?rnd=' + rnd;

// 异常包含
try {
    // 请求过程、返回
    resData = request('GET',url);
    if (resData.statusCode == 200){
        results = resData.getBody('utf8');
    }else{
        log.reqError(interFace,resData.statusCode,'GET request Status is not Fine!!');
    }
} catch(e) {
    // 异常处理的地方
    console.log(e.stack);
}

console.log(results);


function rand16 () {
    var str = '0.';
    for (var i = 0;i<16;i++){
        var num = Math.floor(Math.random()*10);
        str+=num;
    }
    return str;
}