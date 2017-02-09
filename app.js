function startupMode(){
    var app_params = process.argv.slice(2);
    if(app_params.length===0) return 'production';
    return app_params[0];
}

module.exports.startupMode = startupMode;

var express = require('express');
var app = express();
var port=8181;
var path=require ('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/',express.static('public'));

var database = require('./dataBase');

var DBError;
try {
    database.init();
    DBError=null;
} catch (e) {
    DBError=e;
}

app.get('/', function (req, res) {
   if(DBError!=null) res.sendFile(path.join(__dirname, '/views', 'err_dbconfig.html'));
    else res.sendFile(path.join(__dirname, '/views', 'main.html'));
});

app.get("/mobile", function(req, res){
    var bdate;
    var edate;
    var sUnitlist;

    var pAction= req.query.action;
    if(pAction=='get_units'){
        database.getUnits(
            function (error) {
                res.send({error:""});
            }, function (recordset) {
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

            database.getViewMainDetailData(bdate,edate,sUnitlist,
                function (error) {
                    res.send({error:""});
                }, function (recordset) {
                    var outData= {};
                    outData.items = recordset;
                    res.send(outData);
                });
        }
        else {
            database.getViewMainData(bdate,edate,sUnitlist,
                function (error) {
                    res.send({error:""});
                }, function (recordset) {
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
                res.send({error:""});
            }, function (recordset) {
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
app.get("/sysadmin/startup_parameters", function (req, res) {
    res.sendFile(path.join(__dirname, '/views/sysadmin', 'startup_parameters.html'));
});
app.get("/sysadmin/startup_parameters/store_app_local_config", function (req, res) {

   var outData = {};
    outData=database.getDBConfig();
    res.send(outData);
});
app.post("/sysadmin/startup_parameters/save_app_local_config_and_reconnect", function (req, res) {                      console.log("req.body=", req.body);

    res.send("ok");
});
app.listen(port, function (err) {
});



