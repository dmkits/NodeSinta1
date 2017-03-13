INSERT into t_IORec (ChID, DocID, IntDocID, DocDate, KursMC,
                     OurID, StockID, CompID, CodeID1, CodeID2, CodeID3, CodeID4,CodeID5,
                     Discount, PayDelay, EmpID, Notes, ExpDate, ExpSN, NotDate, NotSN,
                     SupplyDayCount, CurrID, TSumCC_nt,TTaxSum, TSumCC_wt, TNewSumCC_nt, TNewTaxSum, TNewSumCC_wt,
                     TSpendSumCC, TRouteSumCC, StateCode)
VALUES (@ChID, @DocID, @orderID ,@Date,1,
0,0,0,0,0,0,0,0,
0,0,0,0,@Date,0,@Date,0,
0,980,0,0,0,0,0,0,
0,0,0);