---
title: DISKO 1 - picoCTF Write-up
description: Write-up for the picoCTF DISKO 1 forensics image, using strings and a bit of patience to pull out the flag.
permalink: /writeups/disko-1/
lang: en
publish: true
draft: false
enableToc: true
tags:
- Easy
- Forensics
- picoGymExclusive
- picoctf
- writeup
aliases:
- /disko-1/
created: 2026-02-11
date: 2026-02-11
published: 2026-02-11
modified: 2026-02-11
lastmod: 2026-02-11
---

1. Download the compressed image
1. Extract the image with the following command

````bash
gunzip disko-1.dd.gz
````

![Pasted image 20250521211118.png](/CTFs/images/Pasted-image-20250521211118.png)
3. Use the `strings` command to find strings in the image. Additionally pipe the output to the `less` command to stop the overflowing of terminal buffer and to search for the flag.
![Pasted image 20250521211205.png](/CTFs/images/Pasted-image-20250521211205.png)
