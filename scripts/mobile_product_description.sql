
select mp.PriceMC as price,p.UM as um, p.ProdName as prodName
from r_Prods  p
inner join r_ProdMP mp on mp.ProdID=p.ProdID
WHERE p.ProdID = @ProdID ;