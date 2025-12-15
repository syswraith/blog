---
title: "Implementing a Microsoft Logo Interpreter in TypeScript — Part 2"
description: "Part 2: Building the drawing engine for a Microsoft Logo interpreter using the HTML5 Canvas API, angle-based turtle movement, and coordinate transformations."
permalink: "/posts/logo-interpreter-typescript/part-2/"
comments: true
lang: "en"
publish: false
draft: true
enableToc: true

tags:
  - typescript
  - canvas
  - drawing-engine
  - graphics
  - compilers
  - logo
  - parser
  - tokenizer

aliases:
  - "/logo-typescript/drawing/"
  - "/microsoft-logo-drawing/"
  - "/posts/logo-interpreter-typescript/drawing-engine/"

cssclasses: []

socialDescription: "Part 2 of building a Microsoft Logo interpreter in TypeScript — implementing the drawing engine using Canvas, Cartesian updates, and turtle direction handling."
socialImage: "displace_turtle.png"


created: 2025-12-02
date: 2025-12-02
modified: 2025-12-02
lastmod: 2025-12-02
updated: 2025-12-02
last-modified: 2025-12-02
published: 2025-12-02
publishDate: 2025-12-02
---


The drawing part is the most interesting part, you get to see the results of your work. Pat yourselves on the back to those of you who made it till here (not you @tervicke). 

# Editor

# Canvas

Below are the **Canvas API** methods that we'll need to draw stuff on the screen.

| Name and syntax             | What it does                                      |
| --------------------------- | ------------------------------------------------- |
| `beginPath()`               | Begins a path or resets the current path.         |
| `moveTo(x, y)`              | Sets the start-point of the line in the canvas    |
| `lineTo(x, y)`              | Sets the end-point of the line in the canvas      |
| `stroke()`                  | Draws the line. The default stroke color is black |
| `clearRect(x1, y1, x2, y2)` | Clears specified pixels on the canvas.            |








As we can see, we need the (X, Y) coordinates for the lines. We also need an angle because commands like `RIGHT` and `LEFT` shift the turtle's position by `n` amount.

`RT 10 FD 10` will result in the following:

![[displace_turtle.png]]

Initial experiments with the Canvas API revealed some interesting findings. I was convinced that I needed to convert polar coordinates to cartesian coordinates and vice versa every time I wanted to execute a drawing function.

$$
\begin{aligned}
x &= r \cdot \cos(\theta) \\
y &= r \cdot \sin(\theta) \\

r &= \sqrt{x^2 + y^2} \\
\theta &= \tan^{-1}\left(\frac{y}{x}\right)

\end{aligned}
$$
However only one of these was needed. This is because (X, Y) remain constant throughout and the direction may or may not change. And the Canvas primarily works on Cartesian coordinates.  


<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">I think I might have the drawing part figured out for simple commands. Thought of storing the coordinates in polar form first but since I&#39;ll have to recalculate them each time, decided to go with cartesian instead. <br><br>This is fun! <a href="https://t.co/uxZcx2itmY">pic.twitter.com/uxZcx2itmY</a></p>&mdash; syswraith (@syswraith) <a href="https://twitter.com/syswraith/status/1978749007724748813?ref_src=twsrc%5Etfw">October 16, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>