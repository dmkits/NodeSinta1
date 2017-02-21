
SELECT 'Продажи нал' as label, SUM(pays.SumCC_wt) AS value
FROM t_SalePays pays
INNER JOIN t_Sales sales ON sales.ChID=pays.ChID
WHERE pays.PayformCode=1
AND sales.DocDate BETWEEN  @BDATE  AND @EDATE
AND ','+@StocksList+',' like '%,'+CAST(sales.StockID as varchar(200))+',%'

UNION ALL
SELECT 'Возвраты нал' as label, sum(pays.SumCC_wt) AS value
FROM t_CRRetPays pays
INNER JOIN t_CRRet returns ON returns.ChID=pays.ChID
WHERE pays.PayformCode=1
AND returns.DocDate BETWEEN  @BDATE  AND @EDATE
AND ','+@StocksList+',' like '%,'+CAST(returns.StockID as varchar(200))+',%'

UNION ALL
SELECT 'Вносы нал' as label, sum(SumCC)AS value
FROM t_monIntRec r
INNER JOIN r_Crs cr ON cr.CRID = r.CRID
WHERE r.DocDate BETWEEN @BDATE AND @EDATE
AND ','+@StocksList+',' like '%,'+CAST(cr.StockID as varchar(200))+',%'

UNION ALL
SELECT 'Выносы нал' as label,sum(SumCC)AS value
FROM t_monIntExp e
INNER JOIN r_Crs cr ON cr.CRID = e.CRID
WHERE e.DocDate BETWEEN @BDATE AND @EDATE
AND ','+@StocksList+',' like '%,'+CAST(cr.StockID as varchar(200))+',%'

