var sql = require('mssql');
var dbConfig = {
    host:'localhost\\SQLEXPRESS',
    user:"sa",
    password:"LVCCbu7575",
    database:'GMSData38_20161212'
};

var data="";

function getEmp(errAction,successAction) {
    var conn=new sql.Connection(dbConfig);
    var req = new sql.Request(conn);
    conn.connect(function (err) {
        if(err) { errAction(err); return;}

        req.query(" select StockID,StockName, REPLACE(StockName,'Магазин IN UA ','') as SHORT_NAME, "+
            "StockID , StockName "+
            "from r_Stocks where StockID>0 and StockID<10", function(err, recordset){
            if(err) { errAction(err); return;}
            else {
                successAction(recordset);
                data= recordset;
            }
            conn.close();
        })
    });

}
getEmp();
// getEmp( function (error) {
//         console.log("getEmp error:",error);
//     }, function (recordset) {
//
//         console.log("getEmp result:", recordset);
//     });
exports.data=data;



//C:\Users\ianagez\WebstormProjects\NodeSinta1
//C:\Users\ianagez\sinta_13.12
