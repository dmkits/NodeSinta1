select ProdName as label, SUM(Qty) as value, p.ProdID as prodId
from r_Prods p
inner join t_Rem r on r.ProdID=p.ProdID and r.Qty>0 and r.ProdID>0
where p.PCatID=@PCatID
group by ProdName,p.ProdID
order by ProdName;