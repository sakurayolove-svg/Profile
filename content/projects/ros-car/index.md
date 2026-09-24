---
date: 2023年02月
title: ROS无人车
image: ros-car.png
content: 独立完成 ROS 无人车建图与路径规划
tags: [ROS, SLAM, C]
---

## 项目内容
在学校控制实验室场地，以树莓派为主控，用 ROS 完成无人车二维建图与 SLAM 导航。

![无人车整车](ros-car.png)

![车模与电源线](ros-chassis.jpg)

## 负责工作
项目由个人完成。程序编写以 C 语言为主，选用激光雷达、IMU 等外设实现二维建图和路径规划控制。

![IMU 与激光雷达接头](ros-imu-lidar.jpg)

完成二维栅格建图。

![栅格地图](ros-grid-map.png)

先在 Gazebo 中做程序仿真和路径规划调试，再进行实物调试。

![导航器结构](ros-navigator.png)
