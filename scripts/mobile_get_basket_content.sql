SELECT rd.ProdID,p.ProdName, rd.UM, rd.PriceCC_wt, rd.Qty
FROM t_ioRecD rd
INNER JOIN t_ioRec r ON r.ChID=rd.ChID
INNER JOIN r_Prods p ON p.ProdID=rd.ProdID
WHERE r.IntDocId = @DocID;