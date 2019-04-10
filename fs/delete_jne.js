
const fs = require('fs')
const request = require('request')



//5.fs.readFile 读取文件
fs.readFile('delete_bn.txt',function (err,data) {
    if (err){
        console.log(err);
        return false;
    }
    // console.log(data);
    // console.log(data.toString());

    var file = data.toString();
    var filelist = file.split('\n')

    for (let i=0;i<filelist.length;i++){

        var bn = filelist[i]
        console.log(bn)
        fs.appendFile('delete_jne.txt',`${bn}\n`,function (err) {
            if (err){
                console.log(err);
                return false;
            }
            console.log(`${bn}\n`);
        })


    }






})