---
title: Time Machine - picoCTF Write-up
description: Write-up for the picoCTF Time Machine challenge, using git history and a bit of grep to recover the flag from the past.
permalink: /writeups/time-machine/
lang: en
publish: true
draft: false
enableToc: true
tags:
- Easy
- picoCTF2024
- git
- picoctf
- writeup
aliases:
- /time-machine/
created: 2026-02-11
date: 2026-02-11
published: 2026-02-11
modified: 2026-02-11
lastmod: 2026-02-11
---

1. Download the file and unzip it
   ![Pasted image 20250522125548.png](/CTFs/images/Pasted-image-20250522125548.png)
1. `cd` into the file
1. `ls -la` reveals the `.git`
1. Use `grep -r "picoCTF"` to recursively grep for the flag.

![Pasted image 20250522125703.png](/CTFs/images/Pasted-image-20250522125703.png)
