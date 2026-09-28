---
date: 2024年02月
title: High-Immunity, High-Sensitivity Rogowski-Coil Current Sensor
image: rogowski-chip.png
content: A Rogowski coil as the front-end differentiator, followed by a low-DC-offset integrator and a DC compensation circuit, for a high-immunity, high-sensitivity current sensor.
tags: [Power Electronics, Circuit Design, Physical Modeling]
---

## Project

A Rogowski coil as the front-end differentiator, followed by a low-DC-offset integrator and a DC compensation circuit, for a high-immunity, high-sensitivity current sensor.

![实验平台](rogowski-setup.jpg)

![rogowski-chip](./rogowski-chip.png)

## Responsibilities

Targeting high bandwidth, low DC offset, and high gain, I chose a passive–active cascaded integrator. Tests showed gain above 10e6 with bandwidth of 33.6MHz.

![image-20260925180943176](./rogowski-integer02.jpg)

A sample–filter–hold (SFH) method recovered the DC component lost in the integrator. After circuit simulation and debugging, Buck current waveforms were used to check integration and compensation; DC offset fell from 13A to 0.5A.

![image-20260925183036467](./rogowski-sfh-principle.png)

<!-- ![Buck 电流波形](rogowski-waveform.png) -->
