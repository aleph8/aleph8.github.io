--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Cybersecurity 
date: "2023-02-24" 
description: 
image: landing.png
series: 
tags: 
title: Packet Sniffing (Concept)
--- 

A sniffing attack is performed by capturing packets in the traffic of a network, being able to access its content and collect data, including viewing credentials in clear text due to an unsecured connection.

But how can this happen? Actually this technique is used for network analysis, possible problems that may occur, and is targeted at certain equipment. By default our network card or NIC usually has this function disabled by a mode known as "promiscuous mode"; by activating this mode, we enable the NIC to receive all traffic, which can be used to automate network analysis, or for less ethical actions.



Not only this, but in case an attacker is looking for certain information, he can filter all the packets to find it, leaving a continuous process that is permanently scanning the target network.

In addition to credential theft, it can lead to a number of attacks, for example:

+ **Password Sniffing**: what we have discussed above. It usually happens in public networks with weak security.

+ **DNS poisoning**: consists of redirecting traffic to fake sites (phishing).

+ **Session Hijacking**: the use of the recorded information can be used to 'spoof' the identity in  platform and be able to log in without the use of credentials.
