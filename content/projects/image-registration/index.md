---
date: 2025年04月
title: 无监督多模态图像配准
image: reg-framework.png
content: 毕设完成无监督配准，TRE 降至 2.44±1.11mm
tags: [多模态, 图像配准, Python]
---

## 项目内容
毕业设计将 TRE 从 2.773±1.273mm 降至 2.44±1.11mm，使用 MIND-SSC 特征提取器提取独立特征，利用权重平衡优化得到有效且无监督的形变场，再通过多层金字塔优化做多尺度对齐，对术中 US 与术前 MRI 实现静态配准。

固定图像为术中超声。

![术中超声固定图](reg-fixed-us.png)

移动图像为术前 MRI。

![术前 MRI 移动图](reg-moving-mri.png)

配准后得到变形的 MRI。

![配准后 MRI](reg-warped-mri.png)

## 负责工作
针对不同模态的术前医学图像做模块化适配，并在特征提取前加入前采样。

![特征提取前采样](reg-presample.png)

在原有算法中加入多级金字塔，耦合不同尺度的优化结果。

![多层金字塔](reg-pyramid.png)

在一致性约束中加入 Adam，在耦合优化中引入权重平衡，得到有效且无监督的形变场。

![加入前采样的算法框架](reg-framework.png)
