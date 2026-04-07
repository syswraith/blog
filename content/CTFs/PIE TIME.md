---
title: "PIE TIME - picoCTF Write-up"
description: "Write-up for the picoCTF PIE TIME challenge, simple binary exploitation focusing on ASLR."

permalink: "/writeups/pie-time/"
lang: "en"

publish: true
draft: false
enableToc: true

tags:
  - Easy
  - BinaryExploitation
  - picoctf
  - writeup

aliases:
  - "/pie-time/"
---
1. On launching the instance, we get two files- an executable and a script
2. On analyzing the script, we can see that by inputting an address in hexadecimal format, we can jump to anywhere in the script.
3. On further analysis, we come across the following mechanism implemented by the OS (in my case Linux)- [Address Space Layout Randomization (ASLR)](https://ctf101.org/binary-exploitation/address-space-layout-randomization/)

> Address Space Layout Randomization (or ASLR) is the randomization of the place in memory where the program, shared libraries, the stack, and the heap are.

4. This also implies the existence of two types of addresses, both of which refer to the same function at different times:
	1. Runtime address
	2. Static address

5. By running `nm` we can get the static addresses of `main()` and `win()`

![[running nm pie time.png]]
6. On running the binary, we can get the runtime address of the main function. Relative to this, we can find the runtime address of the win function, by calculating the base.

$$
Base = Dynamic\ Address\ of\ main()\ -\ Static\ Address\ of\ main()
$$
$$
Dynamic\ Address\ of\ win()\ =\ Static\ address\ of\ win()\ +\ Base
$$

7. We can write the following Python script to make things easier

```Python
static_main = 0x133D
static_win = 0x12A7

def get_win(dynamic_main):
    base = dynamic_main - static_main
    result = static_win + base
    print(hex(result))

get_win(int(input("(dynamic_main)> "), 16))
```

8. Now let's run the challenge

![[connecting pie time.png]]

9. We'll input this address as the dynamic main address in our script

![[pie time script.png]]

10. And we have the flag :)

![[pie time flag.png]]
