
var fs = require('fs');
var sql = require('mssql');

var app = require('./app');

try {
    var dbConfig = require('./' + app.startupMode() + '.cfg.json');
}
catch(err){
    console.log("Wrong mode");
}


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
module.exports.getMainView= function(bdate, edate, unit_condition,errAction, successAction) {
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

module.exports.getDetailMainView= function(bdate, edate, unit_condition,errAction, successAction) {
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
