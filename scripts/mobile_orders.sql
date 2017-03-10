select PCatName as label,p.PCatID as catid, SUM(Qty) as value
from r_ProdC pc
inner join r_Prods p on p.PCatID=pc.PCatID
inner join t_Rem r on r.ProdID=p.ProdID and r.Qty>0 and r.ProdID>0
group by PCatName, p.PCatID 
order by PCatName;