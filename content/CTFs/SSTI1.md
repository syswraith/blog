---
title: SSTI1 - picoCTF Write-up
description: Write-up for the picoCTF SSTI1 challenge, starting with a bit of XSS and ending with full-on Jinja2 server-side template injection and RCE.
permalink: /writeups/ssti1/
lang: en
publish: true
draft: false
enableToc: true
tags:
- Easy
- WebExploitation
- picoCTF2025
- picoctf
- writeup
aliases:
- /ssti1/
created: 2026-02-11
date: 2026-02-11
published: 2026-02-11
modified: 2026-02-11
lastmod: 2026-02-11
---

1. Start the Challenge
   
   ![Pasted image 20250529111924.png](/CTFs/images/Pasted-image-20250529111924.png)

1. Some quick reconnaissance tells us that the website is running on a Flask server.
   
   ![Pasted image 20250529112327.png](/CTFs/images/Pasted-image-20250529112327.png)

1. Putting in `<script>alert('Hello world')</script>` tells us that the server is vulnerable to **XSS injection**.
   
   ![Pasted image 20250529112244.png](/CTFs/images/Pasted-image-20250529112244.png)

1. Here's where we go a bit off-road. The challenge tells us to use **Server-side template injection**. That's a good start as any. I googled `server side template injection python flask` and came across this page: https://portswigger.net/web-security/server-side-template-injection

1. After trying all the templates, we can infer that the server is running a Jinja2 template engine.
   
   ![Pasted image 20250529112720.png](/CTFs/images/Pasted-image-20250529112720.png)
   ![Pasted image 20250529112832.png](/CTFs/images/Pasted-image-20250529112832.png)

1. I searched for `server side template injection jinja2 payloads` and came across this article https://www.onsecurity.io/blog/server-side-template-injection-with-jinja2/ `{{request.application.__globals__.__builtins__.__import__('os').popen('id').read()}}` was the demo payload in the article. https://man7.org/linux/man-pages/man3/popen.3.html this tells us that `popen()` takes in strings and executes them as commands. Jackpot! RCE!

1. However, we need it to execute a different command for us. Here's the on that gets us the flag.`{{request.application.__globals__.__builtins__.__import__('os').popen('grep -r "picoCTF"').read()}}`
   ![Pasted image 20250529113636.png](/CTFs/images/Pasted-image-20250529113636.png)
