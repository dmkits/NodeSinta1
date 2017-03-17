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
    fs.writeFile(dbConfigFilePath, JSON.stringify(dbConfig), function (err, success) {
        callback(err,success);
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
    var query_str = fs.readFileSync('./scripts/mobile_units.sql', 'utf8');
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
module.exports.getDetailViewData= function(detail_id, bdate, edate, unit_condition,callback) {
    var reqSql = new sql.Request(conn);
        var query_str=fs.readFileSync('./scripts/mobile_detail_view_'+detail_id+'.sql', 'utf8');
        reqSql.input('BDATE',sql.Date,bdate);
        reqSql.input('EDATE',sql.Date,edate);
        reqSql.input('StocksList',sql.NVarChar,unit_condition );
        reqSql.query(query_str,
            function (err, recordset) {
                if (err) {
                    callback(err);
                } else {
                    callback(null,recordset);
                }
            }
        )
};
module.exports.getResultToNewQuery=function(newQuery, parameters, callback ){
    var reqSql = new sql.Request(conn);
    var newQueryString=newQuery.text;

    for(var paramName in parameters) reqSql.input(paramName, deleteSpaces(parameters[paramName]));

        reqSql.query(newQueryString,
            function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null,result);
                }
            })
};
function deleteSpaces(text){
    if(text.indexOf(" ")!=-1){
        text = text.replace(/ /g,"");
    }
    return text;
}

module.exports.getOrders = function (callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_orders.sql', 'utf8');
    reqSql.query(query_str,
        function (err, recordset) {
            if (err)
                callback(err, null);
            else
                callback(null, recordset);
        });
};

module.exports.getDetailsOrders = function (capid, callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_brand_items.sql', 'utf8');

    reqSql.input('PCatID',sql.Int, capid);
    reqSql.query(query_str,
        function (err, recordset) {
            if (err)
                callback(err, null);
            else
                callback(null, recordset);
        });
};

module.exports.getProdDecription = function (ProdID, callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_product_description.sql', 'utf8');

    reqSql.input('ProdID', ProdID);
    reqSql.query(query_str,
        function (err, recordset) {
            if (err)
                callback(err, null);
            else
                callback(null, recordset);
        });
};

module.exports.createNewOrder = function (uID, callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_add_new_order_head.sql', 'utf8');
    var date = new Date();
    reqSql.input('orderID',sql.NVarChar, uID);
    reqSql.input('Date',sql.DateTime, date);
        reqSql.query(query_str,
        function (err,recordset) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, recordset);
            }
        });
};

module.exports.checkOrderByID= function (uID, callback) {
    var reqSql = new sql.Request(conn);
    reqSql.input('orderID',sql.NVarChar, uID);
    reqSql.query(" select * from t_ioRec where IntDocID=@orderID;",
        function (err,recordset) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, recordset[0]);
            }
        });
};

module.exports.addItemToOrder = function (ChID,ProdID, callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_add_item_to_order.sql', 'utf8');

    reqSql.input('ChID',sql.Int, ChID);
    reqSql.input('ProdID',sql.Int, ProdID);
    reqSql.input('Qty',sql.Int, 1);

    reqSql.query(query_str,
        function (err,recordset) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, recordset);
            }
        });
};

module.exports.getBasketItems = function (DocID, callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_get_basket_content.sql', 'utf8');

    reqSql.input('DocID',sql.NVarChar, DocID);

    reqSql.query(query_str,
        function (err,recordset) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, recordset);
            }
        });
};

module.exports.deleteItemFromOrder = function (ChID,ProdID, callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_delete_item_from_order.sql', 'utf8');

    reqSql.input('ChID',sql.Int, ChID);
    reqSql.input('ProdID',sql.Int, ProdID);

    reqSql.query(query_str,
        function (err,recordset) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, recordset);
            }
        });
};