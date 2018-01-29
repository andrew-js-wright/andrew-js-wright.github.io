---
title: Is IP Whitelisting Secure?
layout: post 
tags:
- security
- ip
- network 
--- 

IP whitelisting is a common security measure used to protect web services. It filters traffic by the source IP address allowing pre-approved addresses to access the service. It’s been around for a long time and recently a colleague asked if it was still secure. As discussed below, IP whitelisting isn’t a silver bullet but in the right circumstances is still a useful security control.

Before we can get into whether something is secure or not we need to define what secure means. A common rubric used to measure the security of a system is it’s ability to protect Confidentiality, Integrity and Availability. Lets apply that to IP whitelisting and see how it holds up.

# Confidentiality (keep it secret)
In order for an attacker to bypass IP whitelisting they would need to get access to the whitelisted network or spoof the source IP address of a network packet.
If they’re in the first camp and actually have a whitelisted IP, then all hope is lost; IP whitelisting won’t stop a whitelisted IP.
So let’s look at IP source address spoofing. If an attacker doesn’t have access to a whitelisted IP they can use readily available tools to change their source address to a whitelisted one, tricking the server into thinking they’re legit traffic. However when the sever responds to the request they will set the source address of the response to the whitelisted address which as far as the attacker is concerned will be lost in the either.

# Integrity (keep it safe)
So an attacker who spoofs their IP address won’t be able to access the response of a request but surely the fact the the server will accept the request is bad news in and of itself. It’s bad news if your server is accepting requested over unreliable network protocols (e.g. UDP), thankfully however, most services that we work with use HTTP, based on TCP which has a handshake at the start of each session. This mechanism, originally introduced to make sure communication was delivered successfully, means that an attacker with a spoofed address won’t be able to receive the server’s side of the handshake to establish a session and therefore the server won’t accept any commands from them. So assuming a reliable network protocol e.g. TCP, the integrity of our data should be secure against a spoofed IP address.

# Availability (keep it alive)
So an attacker can’t read or update our data but they may be content just to prevent our server from responding to requests. An increasingly common type of attack on a server’s availability is the DDoS (Distributed Denial of Service) attack. This attack uses a network of devices controlled by the attacker to flood the victim’s service with requests. The source of these requests is often masked using IP address spoofing. If these requests were given a source address of a whitelisted IP they would be accepted by the server and it would reserve some memory to record that a TCP session is being established and send a response. These attacks can result in all of the memory allocated for TCP sessions to be filled and therefore prevent any additional sessions being created. Another risk is that the bandwidth of the server’s inbound traffic is maxed and no other traffic can get through. So we’re going to need something to protect us against denial of service attacks even if we do have IP whitelisting enabled.

# Conclusion
Assuming your attacker doesn’t have access to a whitelisted IP address and your using a reliable network protocol, such as TCP, IP whitelisting help keep your data secret and safe. What it won’t guarantee is that unwanted requests won’t reach your service, due to the ease of IP source address spoofing. You’re going to need something else protect against denial of service attacks.
