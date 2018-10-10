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
        var page_pathname = url.parse(pagrurl).pathname;
        let pageNameARR = page_pathname.split('/');
        if (pageNameARR.length==3){
            page_pathname+= '/' + pageNameARR[pageNameARR.length - 1]
        }
        var pageName = pageNameARR[pageNameARR.length - 1];
        let absolout_address = path.join(baseUrl,page_pathname);
        fs.readFile(absolout_address + '.ftl',function (err,data) {
            if (err){
                console.log(err);
                var endObj = {
                    status:'0',
                    msg:"链接错误或该页面已下架"
                }
                var endString = JSON.stringify(endObj);
                res.writeHead(200,{"Content-Type":"application/json; charset='utf-8'"});
                res.end(endString);
                return false;
            }
            var html = data.toString();
            var $ = cheerio.load(html);
            var ifwide = pageName.split('_').indexOf('wide');
            var priceArr = [];
            var inps = $('#radioCombox input');
            if ((ifwide== -1) || inps != "" ){
                if (inps == ""){
                    var script = $('script[type="text/javascript"]').html();
                    var packagelistStr = script.match(/packagelist[^\]]*\]/);
                    var packageObj = "var " + packagelistStr[0].replace(/\s/g,"");
                    eval(packageObj);
                    for (let i = 0; i< packagelist.length; i++){
                        if (priceArr.indexOf(packagelist[i].price) == -1){
                            priceArr.push(packagelist[i].price);
                        }
                    }
                    var endObj = {
                        status:'1',
                        endPrice:priceArr,
                        msg:"模板5页面"
                    }
                }else{
                    for (let i = 0; i< inps.length; i++){
                        var thisPrice = inps.eq(i).attr('data-price');
                        if (i==0 && thisPrice!=undefined){
                            priceArr.push(thisPrice);
                        }else if(priceArr.indexOf(thisPrice) == -1 && thisPrice!=undefined){
                            priceArr.push(thisPrice);
                        }
                    }
                    if (priceArr.length==0){
                        var endObj = {
                            status:'0',
                            msg:"模板一，需手动改成模板二"
                        }
                    }else{
                        var endObj = {
                            status:'1',
                            endPrice:priceArr,
                            msg:"模板2或模板3页面"
                        }
                    }
                }
            }else if(ifwide!= -1 && inps == ""){
                var combo = JSON.parse($('#combe').val());
                for (let i = 0; i< combo.length; i++){
                    priceArr.push(combo[i].price);
                }
                var endObj = {
                    status:'1',
                    endPrice:priceArr,
                    msg:"宽屏页面"
                }
            }
            endObj.local_url = "localhost:8000" + page_pathname + "?cf=localhost";
            var endString = JSON.stringify(endObj);
            res.writeHead(200,{"Content-Type":"application/json; charset='utf-8'"});
            res.end(endString);
        })
    }
    if (pathname=='/change_price_query') {
        var new_price = JSON.parse(pathObj.query.new_price);
        var old_price = JSON.parse(pathObj.query.old_price);
        let pagrurl = pathObj.query.urls;
        let page_pathname = url.parse(pagrurl).pathname;

        let pageNameARR = page_pathname.split('/');
        if (pageNameARR.length==3){
            page_pathname+= '/' + pageNameARR[pageNameARR.length - 1]
        }
        var pageName = pageNameARR[pageNameARR.length - 1];
        let absolout_address = path.join(baseUrl,page_pathname);


        fs.readFile(absolout_address + '.ftl',function (err,data) {
            if (err){
                console.log(err);
                return false;
            }
            var html = data.toString();
            for (let i = 0;i<new_price.length;i++){
                var reg = new RegExp(old_price[i],"g");
                html = html.replace(reg,new_price[i]);
            }
            fs.writeFile(absolout_address + '.ftl',html,function (err,data) {
                if (err){
                    console.log(err);
                    return false;
                }
                res.writeHead(200,{"Content-Type":"application/json; charset='utf-8'"});
                res.end('1');
            })
        })
    }
    staticServe.creatStaticServe(req,res,'../static');
}).listen(8001);