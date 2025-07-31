# 大跌底部判斷

使用「股價淨值比」跟「本益比」便宜股數量來推估，
來看大跌是否將足夠多的股票打入「便宜股」。
當「便宜股」夠多時，就代表可能已經跌無可跌，而目前台股多殺多的情況下，是否已經是最低點了呢？

## 「淨值比便宜股」和「本益比便宜股」

便宜股有很多種，有些可以用公司的淨值跟股價做判斷
也可以是公司的營收

### 淨值比便宜股
是指台灣上市上櫃，股價淨值比 < 0.6 的股票。

### 本益比便宜股
是指台灣上市上櫃，本益比 < 8 的股票。

## 程式碼


### 淨值比便宜股

計算「淨值比便宜股」佔所有上市上櫃的股票比例
``` py
from finlab import data

# 計算淨值比便宜股
pb = data.get('price_earning_ratio:股價淨值比')
small_pb_ratio = (pb < 0.6).sum(axis=1) / pb.notna().sum(axis=1)
```
### 本益比便宜股
計算「本益比便宜股」佔所有上市上櫃的股票比例
``` py
# 計算本益比便宜股
pe = data.get('price_earning_ratio:本益比')
small_pe_ratio = (pe < 10).sum(axis=1) / pe.notna().sum(axis=1)
```

### 繪製圖表

``` py
from finlab import plot

plot.plot_tw_stock_candles('0050', recent_days=100000, resample='M', technical_func={
  'small_pb_ratio': lambda ohlcv: small_pb_ratio.reindex(ohlcv.index, method='ffill'),
  'small_pe_ratio': lambda ohlcv: small_pe_ratio.reindex(ohlcv.index, method='ffill'),
})
```
![alt text](pe-pb-chart.png "Title")


## 指標意義

當台股位於高檔時，「淨值比便宜股」跟「本益比便宜股」數量偏低。
當台股暴跌至低點，「淨值比便宜股」跟「本益比便宜股」數量會*雙雙* 暴漲。
假如下跌時，只觀察到其中一個指標暴漲，不足以證明台股已經跌至低點。

