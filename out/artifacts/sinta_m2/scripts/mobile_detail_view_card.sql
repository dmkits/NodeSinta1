
SELECT 'Продажи ПК' as label, SUM(pays.SumCC_wt) AS value
FROM t_SalePays pays
INNER JOIN t_Sales sales ON sales.ChID=pays.ChID
WHERE pays.PayformCode=2
AND sales.DocDate BETWEEN  @BDATE  AND @EDATE
AND ','+@StocksList+',' like '%,'+CAST(sales.StockID as varchar(200))+',%'

UNION ALL
SELECT  'Возвраты ПК' as label, sum(pays.SumCC_wt)AS value
FROM t_CRRetPays pays
INNER JOIN t_CRRet returns ON returns.ChID=pays.ChID
WHERE pays.PayformCode=2
AND returns.DocDate BETWEEN  @BDATE  AND @EDATE
AND ','+@StocksList+',' like '%,'+CAST(returns.StockID as varchar(200))+',%'
