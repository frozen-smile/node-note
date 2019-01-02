//nodemailer网站：https://nodemailer.com/about/

var express = require('express');
var nodemailer = require('nodemailer');
var ejs = require('ejs');
var bodyParser = require('body-parser');


var app = express();

app.set('view engine','ejs'); //设置模板引擎为ejs
app.engine('html',ejs.renderFile); //使用ejs渲染html文件
app.set('views','../static/'); //设置HTML的路径
app.use(bodyParser.urlencoded({extended:false})) //使用body-parser
app.use(express.static('../static')); //使用静态文件服务


app.get('/contact',function (req,res) {
    res.render('contact.html');
})


app.post('/sendemail',function (req,res) {
    var parma = req.body;

    res.json({"status":1})

    nodemailer.createTestAccount((err, account) => {
        // 创建邮件发送对象
        let transporter = nodemailer.createTransport({
            host: 'smtp.163.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "superguts555@163.com", // generated ethereal user
                pass: "3821555hjx!" // generated ethereal password
            }
        });
        //设置邮件内容
        let emaildata = {
            from: 'superguts555@163.com', // sender address
            to: 'superguts555@163.com', // list of receivers
            subject: parma.title, // Subject line
            text: `用户姓名：${parma.name}\n用户邮箱：${parma.email}\n订单号：${parma.orderNum}\n用户留言：${parma.msg}`, // plain text body
            // html: '<b>Hello world?</b>' // html body
        };

        // 发送邮件
        transporter.sendMail(emaildata, (error, info) => {
            if (error)  return console.log(error);
            console.log('Message sent: %s', info.accepted);
            // Preview only available when sending through an Ethereal account
        });
    });
})



app.listen(3000,function (err) {
    if (err){
        throw err
    }
    console.log('start success!\nExample app listening on port 3000!');
})


