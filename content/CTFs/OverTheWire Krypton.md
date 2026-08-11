---
title: OverTheWire Krypton - Write-up
description: Write-up for the OverTheWire Krypton wargame levels.
permalink: /writeups/overthewire-krypton/
lang: en
publish: false
draft: true
enableToc: true
tags:
- ctf
- overthewire
- wargame
- writeup
- linux
- cryptography
aliases:
- /overthewire-krypton/
---

## Level 0

base64
KRYPTONISGREAT

## Level 1

rot13
ROTTEN

## Level 2

caesariseasy
CAESARISEASY

## Level 3

bad frequency analysis
BRUTE

## Level 4

vigenere
CLEAR TEXT

## Level 5

kasiski exampination
RANDO M

## Level 6

LFSRISNOTRANDOM

````Python
cipher = "PNUKLYLWRQKGKBE"
cipherlen = len(cipher)

# now lets see the random number shifting patterns
text = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
enc_text = 'EICTDGYIYZKTHNSIRFXYCPFUEOCKRN'

shifts = []

for j,i in enumerate(text):
    shifts.append((ord(enc_text[j]) - ord(i)))

for j, i in enumerate(cipher):
    c = ord(i) - ord('A')
    p = (c - shifts[j]) % 26
    print(chr(p + ord('A')), end='')

print()

````

## Level 7
