---
title: hashcrack - picoCTF Write-up
description: Write-up for the picoCTF hashcrack challenge, stepping through a few different hash types until the flag finally drops.
permalink: /writeups/hashcrack/
lang: en
publish: true
draft: false
enableToc: true
tags:
- Easy
- Cryptography
- picoCTF2025
- picoctf
- writeup
aliases:
- /hashcrack/
created: 2026-02-11
date: 2026-02-11
published: 2026-02-11
modified: 2026-02-11
lastmod: 2026-02-11
---

1. Problem statement
   ![Pasted image 20250521112630.png](/CTFs/images/Pasted-image-20250521112630.png)
   ![Pasted image 20250521112739.png](/CTFs/images/Pasted-image-20250521112739.png)
1. Install [hashcat](https://hashcat.net/hashcat/) and [rockyou.txt](https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt). Save the identified hash in a file (here I'm saving it in the file `company.hash`).
1. There's a ton of hashing algorithms that `hashcat` can crack. A list of them is available at https://hashcat.net/wiki/doku.php?id=example_hashes
1. Start the bruteforce attack with the following command. The `--show` flag tells us which password matches the given hash.

````bash
hashcat -m 0 company.hash rockyou.txt --show
````

![Pasted image 20250521113849.png](/CTFs/images/Pasted-image-20250521113849.png)

5. On entering the hash, another hash is given to us. This should be fun :)
   ![Pasted image 20250521114025.png](/CTFs/images/Pasted-image-20250521114025.png)
5. On trying to break it with MD5, we get the following error.

![Pasted image 20250521114219.png](/CTFs/images/Pasted-image-20250521114219.png)
7. Not MD5. Going back to the list mentioned in step 3. Maybe...SHA1? Yes!

![Pasted image 20250521114456.png](/CTFs/images/Pasted-image-20250521114456.png)
![Pasted image 20250521114506.png](/CTFs/images/Pasted-image-20250521114506.png)

8. Another hash!

![Pasted image 20250521114614.png](/CTFs/images/Pasted-image-20250521114614.png)

![this-is-where-the-fun-begins-star-wars.gif](/CTFs/images/this-is-where-the-fun-begins-star-wars.gif)

9. Counting the number of characters, we can see that it's 64 characters in length. Which means that we need an algorithm which outputs a 64 character hash. A quick search tells us that `SHA2-256` is what we're looking for.

![Pasted image 20250521115519.png](/CTFs/images/Pasted-image-20250521115519.png)

10. And there we have it!

![Pasted image 20250521115614.png](/CTFs/images/Pasted-image-20250521115614.png)
