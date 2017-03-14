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


    //reqSql.input('BDATE',sql.Date,bdate);
    //reqSql.input('EDATE',sql.Date,edate);
    //if(unit_condition){unit_condition=deleteSpaces(unit_condition)}
    //reqSql.input('StocksList',sql.NVarChar,unit_condition);
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

    reqSql.input('PCatID',sql.Int, capid);                                                                              //  console.log("capid=",capid );
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
        function (err,recordset) {                                                                                     // console.log("204 err",err);
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, recordset);                                                                              console.log("Yes!");
            }
        });
};

module.exports.checkOrderByID= function (uID, callback) {                                                               console.log("module.exports.checkOrderByID");
    var reqSql = new sql.Request(conn);
    reqSql.input('orderID',sql.NVarChar, uID);
    reqSql.query(" select * from t_ioRec where IntDocID=@orderID;",
        function (err,recordset) {
            if (err) {                                                                                                  console.log("err 184", err);
                callback(err, null);
            }
            else {                                                                                                      console.log("recordset 187", recordset[0]);
                callback(null, recordset[0]);
            }
        });
};

module.exports.addItemToOrder = function (ChID,ProdID, callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_add_item_to_order.sql', 'utf8');


    reqSql.input('ChID',sql.Int, ChID);
    //reqSql.input('SrcPosID ,',sql.NVarChar, uID);
    reqSql.input('ProdID',sql.Int, ProdID);
    //reqSql.input('UM',sql.NVarChar, uID);
    reqSql.input('Qty',sql.Int, 1);
    //reqSql.input('PriceCC_wt',sql.NVarChar, uID);

    reqSql.query(query_str,
        function (err,recordset) {                                                                                     // console.log("204 err",err);
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, recordset);                                                                              console.log("Yes!");
            }
        });
};

module.exports.getBasketItems = function (ChID, callback) {
    var reqSql = new sql.Request(conn);
    var query_str = fs.readFileSync('./scripts/mobile_add_item_to_order.sql', 'utf8');
    var date = new Date();

    //reqSql.input('ChID',sql.NVarChar, uID);
    //reqSql.input('SrcPosID ,',sql.NVarChar, uID);
    //reqSql.input('ProdID',sql.NVarChar, uID);
    //reqSql.input('UM',sql.NVarChar, uID);
    //reqSql.input('Qty',sql.NVarChar, uID);
    //reqSql.input('PriceCC_wt',sql.NVarChar, uID);

    reqSql.query(query_str,
        function (err,recordset) {                                                                                     // console.log("204 err",err);
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, recordset);                                                                              console.log("Yes!");
            }
        });
};


