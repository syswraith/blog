---
title: "OverTheWire Leviathan - Write-up"
description: "Write-up for the OverTheWire Leviathan wargame levels."

permalink: "/writeups/overthewire-leviathan/"
lang: "en"

publish: true
draft: false
enableToc: true

tags:
  - overthewire
  - writeup
  - wargame
  - linux
  - binary
  - ltrace

aliases:
  - "/overthewire-leviathan/"

created: 2026-05-26
date: 2026-05-26
published: 2026-05-26
modified: 2026-05-26
lastmod: 2026-05-26
---

> Leviathan is a wargame that has been rescued from the demise of **intruded.net**, previously hosted on leviathan.intruded.net.
> ~ OverTheWire

## Recommended reading material:
- [ltrace](https://man7.org/linux/man-pages/man1/ltrace.1.html): trace library calls.
- [symlinks](https://man7.org/linux/man-pages/man1/ln.1.html): create symlinks.
- [radare2](https://infosec.exchange/@radareorg/111902688941381839): basic inspection commands

## Level 0
- Description: The password is present on the website.

## Level 1
- Description: The password is present in the hidden directory `.backup` inside the `bookmarks.html` file. Recommending the use of `grep -r pass` for a recursive grep

## Level 2
- Description: `r2 analyse main` Analyse the `main()` function using radare2 and look for it in the disassembled code.

## Level 3
- Description: Use `ltrace` to trace library calls. Examine spaces properly and see which part is extracted to check for permission. Then use a symlink to the password file.

## Level 4
- Description: Just `ltrace` the binary to see which string its being compared with using `strcmp()`

## Level 5
- Description: Run the binary present in the `.trash` directory and and convert the output to ASCII chars. Beautiful Python one liner: `print(''.join([ chr(int(i,2)) for i in "00110000 01100100 01111001 01111000 01010100 00110111 01000110 00110100 01010001 01000100 00001010".split() ]))`

## Level 6
- Description: The `/tmp/file.log` should be a symlink to the password file, and should be read quickly before its deleted.

## Level 7
- Description: Inspect the binary with `radare2` and find the number that's in a specific variable. Convert that to decimal and use it as the 4 digit code.

