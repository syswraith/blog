---
title: CrackMe1 - Crackmes.one Write-up
description: Write-up for the Crackmes.one CrackMe1 challenge.
permalink: /writeups/crackme1/
lang: en
publish: true
draft: false
enableToc: true
tags:
  - Easy
  - crackmesone
  - writeup
  - reversing
  - binary
aliases:
  - /crackme1/
created: 2026-03-08
date: 2026-03-08
published: 2026-03-08
modified: 2026-03-08
lastmod: 2026-03-08
---

https://crackmes.one/crackme/60318a0a33c5d42c3d016b5d

Trying [Rizing](https://rizin.re/) and [Cutter](http://cutter.re/) with this one. I know this challenge can be solved without the help of either (just run `strings`, duh).

![[cutter graph.png]]

1. Open the file in Cutter
2. Go to the main function block
3. Switch to the decompiler view. You should see something like this

![[Pasted image 20260307234634.png]]

4. That's the password we need
5. Let's test it in a Windows environment. I'm using Wine because I'm on Linux.

![[Pasted image 20260307234809.png]]

Honestly, DOS commands are so weird.