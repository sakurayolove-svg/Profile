---
date: 2023年09月
title: 蔬菜定价与补货决策
image: veg-spearman.png
content: 蔬菜自动定价与补货模型获省数模二等奖
tags: [数学, 机器学习, Matlab]
---

## 项目内容
由蔬菜类商品的进销存数据出发，构建自动定价与补货优化模型，获湖南省数学建模竞赛二等奖。

## 负责工作
负责全部数据处理、部分建模和论文撰写。先用 Spearman 相关系数对单品聚类，再以带惩罚项的多项式回归拟合销量与定价。

![Spearman 热力图](veg-spearman.png)

![主成分聚类](veg-pca.png)

对单品批发价做 ADF 检验后，用 ARIMA 预测未来一周销量与定价。

![花菜类销量定价预测](veg-price-forecast.png)

用解析法得到定价与补货决策，并在 Matlab 中完成求解。

![优化利润预测](veg-profit.png)
