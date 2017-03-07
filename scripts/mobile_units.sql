select StockID as id, StockName as name, REPLACE(StockName,'Магазин','') as short_name
 from r_Stocks where StockID>0 and StockID<10