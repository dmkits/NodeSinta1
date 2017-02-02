function startupMode(){
    var app_params = process.argv.slice(2);
    if(app_params.length===0) return 'production';
    return app_params[0];
};
module.exports.startupMode = startupMode;

var express = require('express');
var app = express();
var port=8181;
var path=require ('path');

var database=require('./jsondata');

app.use('/',express.static('public'));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/views', 'main.html'));
});
app.get("/mobile", function(req, res){
    var bdate;
    var edate;
    var sUnitlist;

    var pAction= req.query.action;                                                                                      console.log('get  /mobile ?action=',pAction);
    if(pAction=='get_units'){
        database.getUnits(
            function (error) {
                                                                                                                        console.log("getUnits error:", error);
            }, function (recordset) {
                                                                                                                        console.log("getUnits result:", recordset);
                var outData= {};
                var app_params = process.argv.slice(2);
                if(app_params.length===0) outData.mode='production';
                else outData.mode=app_params[0];

                outData.head="Магазины";
                outData.units = recordset;
                res.send(outData);
            });
    }
    if(pAction=='get_main_data'){
        sUnitlist=getUnitlist(req);
        bdate = req.query.bdate;
        edate = req.query.edate;

        if(req.query.detail!==undefined){

            database.getDetailMainView(bdate,edate,sUnitlist,
                function (error) {
                                                                                                                        console.log("getDetailMainView error:", error);
                }, function (recordset) {
                                                                                                                        console.log("getDetailMainView result:", recordset);
                    var outData= {};
                    outData.items = recordset;
                    res.send(outData);
                });
        }
        else {
            database.getMainView(bdate,edate,sUnitlist,
                function (error) {
                                                                                                                        console.log("getMainView error:", error);
                }, function (recordset) {
                                                                                                                        console.log("getMainView result:", recordset);
                    var outData= {};
                    outData.items = recordset;
                    res.send(outData);
                });
        }
    }
    if(pAction=='get_detail_view_data'){
        var detail_id=req.query.detail_id;
        sUnitlist=getUnitlist(req);
        bdate = req.query.bdate;
        edate = req.query.edate;
        database.getDetailViewData(detail_id,bdate,edate,sUnitlist,
            function (error) {
                                                                                                                        console.log("getDetailViewData error:", error);
            }, function (recordset) {                                                                                   console.log("getDetailViewData result:", recordset);
                var outData= {};
                outData.items = recordset;
                res.send(outData);
            });
    }
    function getUnitlist(req){
        sUnitlist="";
        for(var itemName in req.query){
            if (itemName.indexOf("unit_")>=0){
                sUnitlist=" "+sUnitlist+" "+req.query[itemName]+" ";
            }
        }
        // if(req.query.unit_0_id) sUnitlist=" "+sUnitlist+" "+req.query.unit_0_id+" ";
        // if(req.query.unit_1_id) sUnitlist=" "+sUnitlist+" "+req.query.unit_1_id+" ";
        // if(req.query.unit_2_id) sUnitlist=" "+sUnitlist+" "+req.query.unit_2_id+" ";
        // if(req.query.unit_id) sUnitlist=" "+ req.query.unit_id+" ";
        return sUnitlist;
    }
});
app.get("/sysadmin", function(req, res){

    res.sendFile(path.join(__dirname, '/views', 'sysadmin.html'));
});
app.get("/sysadmin/app_state", function(req, res){
    var outData= {};
    outData.mode= startupMode();
    res.send(outData);
});
app.get("/sysadmin/startup_parameters", function(req, res){
    res.sendFile(path.join(__dirname, '/views/sysadmin', 'startup_parameters.html'));
});
app.listen(port, function (err) {                                                                                       console.log('running server on port ' + port);
});

