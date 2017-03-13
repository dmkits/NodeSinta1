
select mp.PriceMC as price,p.UM as um
from r_Prods  p
inner join r_ProdMP mp on mp.ProdID=p.ProdID
WHERE p.ProdName = @ProdName ;