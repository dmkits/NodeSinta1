var fs = require('fs');
var sql = require('mssql');

var app = require('./app');
var dbConfig;
var dbConfigFilePath;


module.exports.loadConfig=function(){
    dbConfigFilePath='./' + app.startupMode() + '.cfg';
    var stringConfig = fs.readFileSync(dbConfigFilePath);
    dbConfig = JSON.parse(stringConfig);
};
var count=0;
var count2=0;
module.exports.getDBConfig=function(){                                                                                  console.log(count++, "dbConfig=",dbConfig );
    return dbConfig;
};
module.exports.setDBConfig=function(newDBConfig){                                                                       console.log(count2++, "module.exports.setDBConfig=");
    dbConfig= newDBConfig;
};
module.exports.saveConfig=function(callback) {
    fs.writeFile(dbConfigFilePath, JSON.stringify(dbConfig), function (err, sucsess) {
        callback(err,sucsess);
    })
};
module.exports.checkDBConnection=function(callback){
    var conn = new sql.Connection(dbConfig);
    conn.connect(function (err) {
        if (err) {
            callback(err.message);
            return;
        }
        callback(null,"connected");
        conn.close();
    });
};
module.exports.getUnits= function(errAction, successAction) {
    var conn = new sql.Connection(dbConfig);
    var reqSql = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            errAction(err);
            return;
        }
        var query_str=fs.readFileSync('./scripts/mobile_units.sql', 'utf8');
            reqSql.query(query_str,
            function (err, recordset) {
                if (err) {
                    errAction(err);
                    return;
                }
                else {
                    successAction(recordset);
                }
                conn.close();
            }
        )
    });
};
module.exports.getViewMainData= function(bdate, edate, unit_condition,errAction, successAction) {
    var conn = new sql.Connection(dbConfig);
    var reqSql = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            errAction(err);
            return;
        }
        var query_str=fs.readFileSync('./scripts/mobile_main_view.sql', 'utf8');
        reqSql.input('BDATE',sql.Date,bdate);
        reqSql.input('EDATE',sql.Date,edate);
        reqSql.input('StocksList',sql.NVarChar,unit_condition );
        reqSql.query(query_str,
            function (err, recordset) {
                if (err) {
                    errAction(err);
                    return;
                }
                else {
                    successAction(recordset);
                }
                conn.close();
            }
        )
    });
};

module.exports.getViewMainDetailData= function(bdate, edate, unit_condition,errAction, successAction) {
    var conn = new sql.Connection(dbConfig);
    var reqSql = new sql.Request(conn);
    conn.connect(function (err) {
        if (err) {
            errAction(err);
            return;
        }
        var query_str=fs.readFileSync('./scripts/mobile_main_view_d.sql', 'utf8');

        reqSql.input('BDATE',sql.Date,bdate);
        reqSql.input('EDATE',sql.Date,edate);
        reqSql.input('StocksList',sql.NVarChar,unit_condition );
        reqSql.query(query_str,
            function (err, recordset) {
                if (err) {
                    errAction(err);
                    return;
                }
                else {
                    successAction(recordset);
                }
                conn.close();
            }
        )
    });
};
module.exports.getDetailViewData= function(detail_id, bdate, edate, unit_condition,errAction, successAction) {
    var conn = new sql.Connection(dbConfig);
    var reqSql = new sql.Request(conn);

    conn.connect(function (err) {
        if (err) {
            errAction(err);
            return;
        }
        var query_str=fs.readFileSync('./scripts/mobile_detail_view_'+detail_id+'.sql', 'utf8');
        reqSql.input('BDATE',sql.Date,bdate);
        reqSql.input('EDATE',sql.Date,edate);
        reqSql.input('StocksList',sql.NVarChar,unit_condition );
        reqSql.query(query_str,
            function (err, recordset) {
                if (err) {
                    errAction(err);
                    return;
                }
                else {
                    successAction(recordset);
                }
                conn.close();
            }
        )
    });
};
