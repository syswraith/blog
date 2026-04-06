---
title: Flag Hunters - picoCTF Write-up
description: Write-up for the picoCTF Flag Hunters challenge, analyzing the source code for a Python echo script.
permalink: /writeups/flag-hunters/
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
  - /flag-hunters/
---
# [PicoCTF Flag Hunters](https://play.picoctf.org/practice/challenge/472?category=3&page=1)

1. Download the file and open it in a text editor.
2. Immediately we can see that the script requires a `flag.txt` file in the same directory. Create it and make it something easy to spot. I'm going for the following:

```bash
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" > flag.txt
```

3. Running the script, we can see that it prints lyrics of a song and asks us for an input at the `CROWD` prompt.

![[initial run flag hunters.png]]
4. On further analysis of the file, we can figure out that the flag is embedded into `secret_intro`. We have to print the song including this `secret_intro`, but something seems to be preventing that from happening.
5. Delving into the printer loop, we can see that the following line allows us to pass arbitrary line numbers by injecting `;RETURN <line_number>`. The lines are also being split with `;` character.

![[split and inject flag hunters.png]]

6. For ease of use, we will remove the `time.sleep(0.5)`. It does not affect the execution, rather it delays it.
7. Enter `;RETURN 0` at the crowd prompt to go to the first line.
8. And we have the flag

![[flag hunters flag.png]]