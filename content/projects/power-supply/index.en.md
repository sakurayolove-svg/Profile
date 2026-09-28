---
date: 2023年08月
title: Power-Electronics Integrated Control System
image: power-framework02.png
content: Based on the main power stage, control, auxiliary supply, gate drive, and sampling, the design covers MPPT for the chopper and constant-voltage, constant-frequency control for the inverter.
tags: [Power Electronics, Control Systems, C]
---

## Project
A 32-bit MCU as the controller for an integrated power system, including the main power stage, control, auxiliary supply, gate drive, and sampling, meeting specified voltage regulation, load regulation, and efficiency.

Tests of the inverter: frequency 50Hz, efficiency 91.25%, THD 3.9%, voltage 24.00V.

![电量测量与控制策略框图](power-framework01.png)

## Responsibilities

Wrote all control software in C.

Measurement: DMA ADC sampling and the DSP library for DC and AC amplitude and frequency;

Control: PID for chopper MPPT and inverter constant-voltage, constant-frequency control;

SPWM: complementary dual-channel SPWM with dead time, fixing missing narrow pulses, and better duty-cycle and harmonic settings for circuit performance.

![电量测量与控制策略框图](power-framework02.png)
