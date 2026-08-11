---
title: The Brochure - TryHackMe Write-up
description: Write-up for the TryHackMe The Brochure challenge, simple OSINT challenge.
permalink: /writeups/the-brochure/
lang: en
publish: true
draft: false
enableToc: true
tags:
- ctf
- Easy
- OSINT
- tryhackme
- writeup
- instagram
- base64
- flag
- bytelotusresorts
aliases:
- /the-brochure/
---

## Challenge link: [The Brochure](https://tryhackme.com/room/hh-thebrochure-081f3e36)

1. Running the file through [Aperi'Solve](https://aperisolve.fr/) doesn't yield any results
2. Searching Instagram for "Byte Lotus Resorts" leads us to [this page](https://www.instagram.com/thebytelotusresort/)
3. The 1 follower looks suspicious. Nice. Base64 encoding.

![[Pasted image 20260725172128.png]]

4. The flag: `THM{V3r@s_aCC0unt_h4s_b33n_f0und!}`
