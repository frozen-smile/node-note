var address = require('./address');
var stores = require('./store');


var citys = address.citys;
var zones = address.zones;
var address = address.address;


var taiwan711 = {};
for (var i = 0; i<citys.length;i++){
    //取当前城市的名字
    var city = citys[i];
    //取当前城市的所有地址
    var nowZones = address[citys[i]];
    //取当前城市所有的区名
    var nowZonesName = zones[i];
    var shi = {};
    for (var j = 0; j<nowZonesName.length;j++){
        //取当前区所有的路
        var nowRoads = nowZones[nowZonesName[j]];
        //当前区的名字
        var zone = nowZonesName[j];
        var xiang = {};
        //遍历路
        for (var k = 0; k<nowRoads.length;k++){
            //取当前路的名字
            var road = nowRoads[k];
            var lu = [];
                for (var l = 0; l<stores.length;l++){
                    var now = stores[l][0];
                    // console.log(now);
                    if (now.indexOf(city)!=-1&&now.indexOf(zone)!=-1&&now.indexOf(road)!=-1){
                        lu = stores[l];
                        // console.log(now)
                    }
                }
            xiang[road] = lu;
        }
        shi[zone] = xiang;
    }
    taiwan711[city] = shi;
}
console.log(taiwan711);



// for (var l = 0; l<stores.length;l++){
//     var now = stores[l];
//     for (var i = 0; i<1;i++){
//         // console.log(citys[i]);
//         for (var j = 0; j<zones[i].length;j++){
//
//             if (now[0].indexOf(citys[i]) != -1&&now[0].indexOf(zones[i][j]) != -1){
//                 console.log(now)
//             }
//         }
//     }
// }














// for (key in address){
//     var city = address[key];
//     var cityName = key;
//     var zone = [];
//     for (ke in city){
//         var road = city[ke];
//
//     }
//     zones.push(zone);
// }