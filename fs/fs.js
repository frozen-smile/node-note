//node FS模块 学习笔记
/*
 1. fs.stat  检测是文件还是目录
 2. fs.mkdir  创建目录
 3. fs.writeFile  创建写入文件
 4. fs.appendFile 追加文件
 5.fs.readFile 读取文件
 6.fs.readdir读取目录
 7.fs.rename 重命名
 8. fs.rmdir  删除目录
 9. fs.unlink删除文件
*/

var fs = require('fs');

//1. fs.stat  检测是文件还是目录
// fs.stat('test',function(err,states){
// 	if(err){
// 	    console.log(err);
// 	    return false;
//     }
//     console.log('文件'+states.isFile());
//     console.log('文件夹'+states.isDirectory());
// })


//2. fs.mkdir  创建目录
//***接收参数： path：路径。 mode：目录读写权限，默认0777。 cb:回调函数，传参err
// fs.mkdir('css',function (err) {
//     if (err){
//         console.log(err);
//         return false;
//     }
//     console.log('文件夹css创建成功');
// })


//3. fs.writeFile  创建写入文件
//filename      (String)            文件名称
//data        (String | Buffer)    将要写入的内容，可以使字符串 或 buffer数据。
//options        (Object)           option数组对象，包含：
//· encoding   (string)            可选值，默认 ‘utf8′，当data使buffer时，该值应该为 ignored。
//· mode         (Number)        文件读写权限，默认值 438
//· flag            (String)            默认值 ‘w'
//callback {Function}  回调，传递一个异常参数err。

// fs.writeFile('writeFile.txt','是否完全覆盖',function (err) {
//     if (err){
//         console.log(err);
//         return false;
//     }
//     console.log('文件创建并写入成功'); // writeFile会对已有的文件进行内容覆盖
// })


//4. fs.appendFile 追加文件
// fs.appendFile('writeFile.txt','\n这是追加的内容',function (err) {
//     if (err){
//         console.log(err);
//         return false;
//     }
//     console.log('内容追加成功');
// })


//5.fs.readFile 读取文件
// fs.readFile('writeFile.txt',function (err,data) {
//     if (err){
//         console.log(err);
//         return false;
//     }
//     console.log(data);
//     console.log(data.toString());
// })


//6.fs.readdir读取目录  把目录下面的文件和文件夹都获取到。
// fs.readdir('../fs',function (err,data) {
//     if (err){
//         console.log(err);
//         return false;
//     }
//     console.log(data);
// })

//7.fs.rename 重命名
//7-1.改名
// fs.rename('fs.html','rename.html',function (err) {
//     if (err){
//         console.log(err);
//         return false;
//     }
//     console.log('fs.html已被重命名为rename.html');
// })

//7-2.移动文件
// fs.rename('rename.html','test/rename.html',function (err) {
//     if (err){
//         console.log(err);
//         return false;
//     }
//     console.log('fs.html已被移动到test文件夹下');
// })


//8. fs.rmdir  删除目录   只能删除空目录

// fs.rmdir('img',function (err) {
//     if (err){
//         console.log(err);
//         return false;
//     }
//     console.log('img文件夹已被删除');
// })


//9. fs.unlink删除文件
fs.unlink('unlink.html',function (err) {
    if (err){
        console.log(err);
        return false;
    }
    console.log('unlink.html已被删除');
})