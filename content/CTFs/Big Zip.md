---
title: Big Zip - picoCTF Write-up
description: Write-up for the picoCTF Big Zip challenge, unzipping a pile of archives and grepping for the flag.
permalink: /writeups/big-zip/
lang: en
publish: true
draft: false
enableToc: true
tags:
- Easy
- GeneralSkills
- picoctf
- writeup
aliases:
- /big-zip/
created: 2026-02-11
date: 2026-02-11
published: 2026-02-11
modified: 2026-02-11
lastmod: 2026-02-11
---

I've done this before (manually) and its no fun.
Instead, here's a stackoverflow answer that helps to unzip files recursively :)
https://stackoverflow.com/questions/107995/how-do-you-recursively-unzip-archives-in-a-directory-and-its-subdirectories-from

After this, you can run good ol' `grep -r "picoCTF{"` to find the flag quickly.
