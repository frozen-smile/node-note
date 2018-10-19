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
            var ifwide = /header_wide\.ftl/.test(html);
            var priceArr = [];
            var inps = $('input[type="radio"][name="name"]');

            if (!ifwide ){
                if (inps == ""){
                    let script = $('script[type="text/javascript"]').html();
                    let packagelistStr = script.match(/packagelist[^\]]*\]/);
                    let packageObj = "var " + packagelistStr[0].replace(/\s/g,"");
                    eval(packageObj);
                    let productInfoStr = script.match(/productInfo[^}]*(?=path)/);
                    let productObj = "var " + productInfoStr[0].replace(/\s/g,"") + "}";
                    eval(productObj);
                    let combo = productInfo.discount_text;
                    let discount_2 = productInfo.discount_2_price_code;
                    let discount_3 = productInfo.discount_3_price_code;
                    for (let i = 0; i< packagelist.length; i++){
                        if (priceArr.indexOf(packagelist[i].price) == -1){
                            priceArr.push(packagelist[i].price);
                        }
                    }
                    var endObj = {
                        status:'1',
                        endPrice:priceArr,
                        combo:combo,
                        discount_2:discount_2,
                        discount_3:discount_3,
                        template:"5",
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
                        let nation = $('#area_code').val();
                        let combo = $('.item_bar').next().text() || $("#money label b").text() || $('.form_act').text();
                        let discount_2 = $('#discount_2_price_code').val();
                        let discount_3 = $('#discount_3_price_code').val();
                        var endObj = {
                            status:'1',
                            endPrice:priceArr,
                            nation:nation,
                            combo:combo,
                            discount_2:discount_2,
                            discount_3:discount_3,
                            template:"2",
                            msg:"模板2或模板3页面"
                        }
                    }
                }
            }else if(ifwide && inps == ""){
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
        var nation = pathObj.query.nation;
        var template = pathObj.query.template;
        var combo = JSON.parse(pathObj.query.combo);
        var discount_2 = JSON.parse(pathObj.query.discount_2);
        var discount_3 = JSON.parse(pathObj.query.discount_3);
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
            if(new_price != ''){
                if (nation == "3" || nation == "5"){
                    let oldPriceFormat = formatNum(old_price[0]);
                    let newPriceFormat = formatNum(new_price[0]);
                    let reg = new RegExp(oldPriceFormat,"g");
                    html = html.replace(reg,newPriceFormat);
                }
                for (let i = 0;i<new_price.length;i++){
                    let reg = new RegExp(old_price[i],"g");
                    html = html.replace(reg,new_price[i]);
                }
            }
            if(combo[1]){
                let reg = new RegExp(combo[0],"g");
                html = html.replace(reg,combo[1]);
            }
            if (discount_2[1]){
                let regstr,new_regstr;
                if (template == "5"){
                    regstr = 'discount_2_price_code:'+ discount_2[0];
                    new_regstr = 'discount_2_price_code:'+ discount_2[1];
                }else if(template == "2"){
                    regstr = 'id="discount_2_price_code" value="'+ discount_2[0] + '"';
                    new_regstr = 'id="discount_2_price_code" value="'+ discount_2[1] + '"';
                }
                let reg = new RegExp(regstr,"g");
                html = html.replace(reg,new_regstr);
            }
            if (discount_3[1]){
                let regstr,new_regstr;
                if (template == "5"){
                    regstr = 'discount_3_price_code:'+ discount_3[0];
                    new_regstr = 'discount_3_price_code:'+ discount_3[1];
                }else if(template == "2"){
                    regstr = 'id="discount_3_price_code" value="'+ discount_3[0] + '"';
                    new_regstr = 'id="discount_3_price_code" value="'+ discount_3[1] + '"';
                }
                let reg = new RegExp(regstr,"g");
                html = html.replace(reg,new_regstr);
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


function formatNum(num) {
    var result = [ ], counter = 0;
    num = (num || 0).toString().split('');
    for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) { result.unshift(','); }
    }
    return result.join('');
}