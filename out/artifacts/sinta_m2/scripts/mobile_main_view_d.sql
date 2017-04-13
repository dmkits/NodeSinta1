
select 'sales'+CAST(st.StockID as varchar(200)) as id, st.StockName, st.StockID  AS unit_id,
    REPLACE(st.StockName,'Магазин','') as short_name,'Реализация ' as label, COALESCE(SUM(TSumCC_wt),0) as value,  '/mobile' as url,
    'sales' as detail_id
    FROM r_Stocks st
LEFT JOIN t_Sale s ON s.StockID=st.StockID AND DocDate BETWEEN  @BDATE AND @EDATE
WHERE ','+@StocksList+',' like '%,'+CAST(st.StockID as varchar(200))+',%'
group by st.StockID, st.StockName


UNION ALL
select 'returns'+CAST(st.StockID as varchar(200)) as id, st.StockName,st.StockID  AS unit_id,
    REPLACE(st.StockName,'Магазин','')as short_name, 'Возвраты ' as label, COALESCE(SUM(TSumCC_wt),0) as value,  '/mobile' as url,
    'returns' as detail_id
FROM r_Stocks st
LEFT JOIN t_CRRet r ON r.StockID=st.StockID AND DocDate BETWEEN @BDATE AND @EDATE
WHERE ','+@StocksList+',' like '%,'+CAST(st.StockID as varchar(200))+',%'
group by st.StockID, st.StockName
--WHERE @StocksList like '%'+CAST(st.StockID as varchar(200))+',%' OR @StocksList like '%,'+CAST(st.StockID as varchar(200))+',%' OR @StocksList like '%,'+CAST(st.StockID as varchar(200))+'%'
--  AND ','+@StocksList+',' like '%,'+CAST(StockID as varchar(200))+',%'

UNION ALL
  SELECT 'cash_income'+CAST(st.StockID as varchar(200)) as id, st.StockName, st.StockID AS unit_id,
    REPLACE(st.StockName,'Магазин','')as short_name ,'Выручка НАЛ ' as label, SUM(m.SumCC_wt) as value,  '/mobile' as url,
    'cash' as detail_id
  FROM r_Stocks st
  LEFT JOIN (
     SELECT sales.StockID, COALESCE(SUM(pays.SumCC_wt), 0) as SumCC_wt
     FROM t_SalePays pays
     INNER JOIN t_Sales sales ON sales.ChID = pays.ChID
WHERE ','+@StocksList+',' like '%,'+CAST(sales.StockID as varchar(200))+',%'
       AND pays.PayformCode = 1 AND sales.DocDate BETWEEN  @BDATE AND @EDATE
     GROUP BY sales.StockID
     UNION ALL
     SELECT crr.StockID, COALESCE(SUM(-crpays.SumCC_wt), 0) as SumCC_wt
     FROM t_CRRetPays crpays
     INNER JOIN t_CRRet crr ON crr.ChID = crpays.ChID
WHERE ','+@StocksList+',' like '%,'+CAST(crr.StockID as varchar(200))+',%'
      AND crpays.PayformCode =1 AND crr.DocDate BETWEEN  @BDATE AND @EDATE
  GROUP BY crr.StockID
 ) m on    m.StockID = st.StockID
WHERE ','+@StocksList+',' like '%,'+CAST(st.StockID as varchar(200))+',%'
GROUP BY st.StockID, st.StockName


UNION ALL
SELECT 'card_income'+CAST(st.StockID as varchar(200)) as id, st.StockName,  st.StockID AS unit_id,
  REPLACE(st.StockName,'Магазин','') as short_name,'Выручка ПК ' as label, SUM(m.SumCC_wt) as value,  '/mobile' as url,
   'card' as detail_id
FROM r_Stocks st
LEFT JOIN (
        SELECT sales.StockID, COALESCE(SUM(pays.SumCC_wt), 0) as SumCC_wt
        FROM t_SalePays pays
            INNER JOIN t_Sales sales ON sales.ChID = pays.ChID
               WHERE ','+@StocksList+',' like '%,'+CAST(sales.StockID as varchar(200))+',%'
               AND pays.PayformCode = 2 AND sales.DocDate BETWEEN  @BDATE AND @EDATE
            GROUP BY sales.StockID
        UNION ALL
        SELECT crr.StockID, COALESCE(SUM(-crpays.SumCC_wt), 0) as SumCC_wt
        FROM t_CRRetPays crpays
            INNER JOIN t_CRRet crr ON crr.ChID = crpays.ChID
                WHERE ','+@StocksList+',' like '%,'+CAST(crr.StockID as varchar(200))+',%'
                AND crpays.PayformCode =2 AND crr.DocDate BETWEEN  @BDATE AND @EDATE
        GROUP BY crr.StockID
) m on    m.StockID = st.StockID
 WHERE ','+@StocksList+',' like '%,'+CAST(st.StockID as varchar(200))+',%'
GROUP BY st.StockID, st.StockName


UNION ALL
SELECT 'other_income'+CAST(st.StockID as varchar(200)) as id, st.StockName,  st.StockID AS unit_id,
REPLACE(st.StockName,'Магазин','')as short_name,'Выручка прочее ' as label, SUM(m.SumCC_wt) as value,  '/mobile' as url,
 'other' as detail_id
FROM r_Stocks st
LEFT JOIN (
SELECT sales.StockID, COALESCE(SUM(pays.SumCC_wt), 0) as SumCC_wt
FROM t_SalePays pays
INNER JOIN t_Sales sales ON sales.ChID = pays.ChID
 WHERE ','+@StocksList+',' like '%,'+CAST(sales.StockID as varchar(200))+',%'
AND NOT pays.PayformCode in (1,2) AND sales.DocDate BETWEEN  @BDATE AND @EDATE
GROUP BY sales.StockID
UNION ALL
SELECT crr.StockID, COALESCE(SUM(-crpays.SumCC_wt), 0) as SumCC_wt
FROM t_CRRetPays crpays
INNER JOIN t_CRRet crr ON crr.ChID = crpays.ChID
 WHERE ','+@StocksList+',' like '%,'+CAST(crr.StockID as varchar(200))+',%'
AND NOT crpays.PayformCode in (1,2) AND crr.DocDate BETWEEN  @BDATE AND @EDATE
 GROUP BY crr.StockID
) m on    m.StockID = st.StockID
  WHERE ','+@StocksList+',' like '%,'+CAST(st.StockID as varchar(200))+',%'
 GROUP BY st.StockID, st.StockName