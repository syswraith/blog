---
title: Devlog for Alkindi
description: A devlog for a cryptanalysis application.
comments: true
lang: en
publish: true
draft: false
enableToc: true
tags:
alias:
cssclasses: []
socialDescription:
---
# Day 00

Frontend is a necessary evil. I learned that the hard way, after participating in hackathons and looking at real world projects. I need to brush up my frontend scripts even if I am trying to head into cybersecurity. 

What I needed was a project that nicely balances out frontend development, cybersecurity and logic. For the longest time I have sat on prototypes of this idea, but now I think I'm in a good position to actually start it.

This isn't one of my usual blogs, rather a devlog of sorts to keep me in check. I'll keep coming back and editing it as I see fit, but a friend of mine told me to focus on what's keeping me interested instead of focusing on goals. That's a nice way to live in my opinion. I'll worry about placements when I get to them.

I'll start with what I implemented today.

## [Counter](https://github.com/syswraith/alkindi/blob/master/src/utilities/Counter.ts)

Very recently, I came across the [collections.Counter](https://docs.python.org/3/library/collections.html#collections.Counter) object in Python. It's a nifty little piece of code that reduces the number of times I have to use loops for something like getting a frequency count on an iterable. My goal today was to replicate a subset of its functionality and implement two basic getter functions I know for sure that I'm going to need.

- `getMap()` Returns a map with frequency by occurrence of each element in the iterable.
- `getPercentMap()` Returns a map with frequency by percentage of each element in the iterable.

Internally, I wanted the `Map()` object to be restricted to strings and numbers (just in case). For this I learned that one must use getters and setters over normal indexing. Also I learned about the [nullish coalescing operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing) which is used when you want to default to a value if you encounter `null` or `undefined`. 

Below is a loop to iterate over an iterable and count its frequency.

```ts
for (let i of this.iterable) {
    this.map.set(i, (this.map.get(i) ?? 0) + 1);
}
```

Another trick that I used to calculate frequency was the usage of [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce). This method makes calculating the running sum easier. The [spread operator (...)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) allows one to unpack an iterable inside of another iterable (in this case, an array) and then calling the reduce function on it spares us a loop. Also note that without the curly braces, the [arrow operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) will auto-return the values computed inside (basically acting as a [lambda function](https://en.wikipedia.org/wiki/Anonymous_function)).

```ts
let total = [...this.map.values()].reduce((sum, number) => (sum + number), 0);
```
