var fs = require('fs');
var sql = require('mssql');

var app = require('./app');
var dbConfig;
var dbConfigFilePath;

var conn=null;

module.exports.getDBConfig=function(){
    return dbConfig;
};
module.exports.setDBConfig=function(newDBConfig){
    dbConfig= newDBConfig;
};
module.exports.loadConfig=function(){
    dbConfigFilePath='./' + app.startupMode() + '.cfg';
    var stringConfig = fs.readFileSync(dbConfigFilePath);
    dbConfig = JSON.parse(stringConfig);
};
module.exports.saveConfig=function(callback) {
    fs.writeFile(dbConfigFilePath, JSON.stringify(dbConfig), function (err, sucsess) {
        callback(err,sucsess);
    })
};
module.exports.databaseConnection=function(callback){
    if(conn) conn.close();
    conn = new sql.Connection(dbConfig);
    conn.connect(function (err) {
        if (err) {
            callback(err.message);
            return;
        }
        callback(null,"connected");
    });
};

module.exports.getUnits = function (callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_units.sql', 'utf8');                                              console.log("query_str=",query_str);
    reqSql.query(query_str,
        function (err, recordset) {
            if (err)
                callback(err, null);
            else
                callback(null, recordset);
        });
};
module.exports.getViewMainData = function (bdate, edate, unit_condition, errAction, successAction) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_main_view.sql', 'utf8');
    reqSql.input('BDATE', sql.Date, bdate);
    reqSql.input('EDATE', sql.Date, edate);
    reqSql.input('StocksList', sql.NVarChar, unit_condition);
    reqSql.query(query_str,
        function (err, recordset) {
            if (err) {
                errAction(err);
            } else {
                successAction(recordset);
            }
        })
};

module.exports.getViewMainDetailData = function (bdate, edate, unit_condition, errAction, successAction) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_main_view_d.sql', 'utf8');
    reqSql.input('BDATE', sql.Date, bdate);
    reqSql.input('EDATE', sql.Date, edate);
    reqSql.input('StocksList', sql.NVarChar, unit_condition);
    reqSql.query(query_str,
        function (err, recordset) {
            if (err) {
                errAction(err);
            } else {
                successAction(recordset);
            }
        })
};

module.exports.getDetailViewData= function(detail_id, bdate, edate, unit_condition,errAction, successAction) {
    var reqSql = new sql.Request(conn);
        var query_str=fs.readFileSync('./scripts/mobile_detail_view_'+detail_id+'.sql', 'utf8');
        reqSql.input('BDATE',sql.Date,bdate);
        reqSql.input('EDATE',sql.Date,edate);
        reqSql.input('StocksList',sql.NVarChar,unit_condition );
        reqSql.query(query_str,
            function (err, recordset) {
                if (err) {
                    errAction(err);
                } else {
                    successAction(recordset);
                }
            }
        )
};

module.exports.getResultToNewQuery=function(newQuery,errAction, successAction ){
    var reqSql = new sql.Request(conn);

        reqSql.input('BDATE',sql.Date,bdate);
        reqSql.input('EDATE',sql.Date,edate);
        reqSql.input('StocksList',sql.NVarChar,unit_condition );

        //var temp=JSON.stringify(newQuery);                                                                              console.log("newQuery=", newQuery);
        //var newQueryString=temp.substring(1,temp.length-4).replace("\\n","");                                           console.log("newQueryString=", newQueryString);
        //
        var newQueryString=newQuery.text;                                                                                console.log("newQueryString=", newQueryString);
        reqSql.query(newQueryString,
            function (err, result) {
                if (err) {                                                                                              console.log("err 108=", err);
                    errAction(err);
                } else {                                                                                                console.log("result=", result);
                    successAction(result);
                }
            })
};
