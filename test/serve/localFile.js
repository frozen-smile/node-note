var fs = require('fs');

var http = require('http');
var url = require('url');

var path = require('path');
var cheerio = require('cheerio');
var staticServe = require('./staticServe');

const baseUrl = "E:\\ecs_self\\ecs\\src\\ecs\\static";

http.createServer(function (req, res) {

    var pathObj = url.parse(req.url,true);

    var pathname = pathObj.pathname;



    if (pathname=='/') {
        let filepath = path.join(__dirname,"../static/change_price.html");

        fs.readFile( filepath,function (err,data) {
            if (err){
                console.log(err);
                return false;
            }
            res.writeHead(200,{"Content-Type":"text/html; charset='utf-8'"});
            res.end(data);
        })
    }
    if (pathname=='/change_page_query') {
        let pagrurl = pathObj.query.urls;
        let page_pathname = url.parse(pagrurl).pathname;
        let absolout_address = path.join(baseUrl,page_pathname);
        fs.readFile(absolout_address + '.ftl',function (err,data) {
            if (err){
                console.log(err);
                res.writeHead(404,{"Content-Type":"text/html; charset='utf-8'"});
                res.end('404');
            }
            let html = data.toString();
            let $ = cheerio.load(html);
            let priceArr = [];

            let inps = $('.inp input');
            for (let i = 0; i< inps.length; i++){
                if (inps.eq(i).attr('data-price') != priceArr[i-1]){
                    priceArr.push(inps.eq(i).attr('data-price'));
                }
            }
            let endObj = {
                msg:'1',
                endPrice:priceArr,
            }
            let endString = JSON.stringify(endObj);

            console.log(endPrice);

            res.writeHead(200,{"Content-Type":"text/html; charset='utf-8'"});

            res.end(endString);
        })
    }
    if (pathname=='/change_price_query') {
        let price = pathObj.query.price;
        let pagrurl = pathObj.query.urls;
        let page_pathname = url.parse(pagrurl).pathname;
        let absolout_address = path.join(baseUrl,page_pathname);

        fs.readFile(absolout_address + '.ftl',function (err,data) {
            if (err){
                console.log(err);
                return false;
            }
            let html = data.toString();

            console.log(html);

            html = html.replace(/798/g,price);
            // var reg = new RegExp(price,"g");
            // html.replace(reg,price)

            fs.writeFile(absolout_address + '.ftl',html,function (err,data) {
                if (err){
                    console.log(err);
                    return false;
                }
                res.writeHead(200,{"Content-Type":"text/html; charset='utf-8'"});
                res.end('1');
            })
        })
    }
    staticServe.creatStaticServe(req,res,'../static');

}).listen(8001);