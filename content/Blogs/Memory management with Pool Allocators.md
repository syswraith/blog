---
title: Memory management with Pool Allocators
description: Implementing a fixed-size block pool allocator in C to avoid internal fragmentation and optimize memory management for data structures.
comments: true
lang: en
publish: true
draft: false
enableToc: true
tags:
- c
- memory-management
- pool-allocator
- pointers
- data-structures
- systems-programming
alias:
- pool_allocators
cssclasses: []
socialDescription: A deep dive into implementing a pool allocator in C using fixed-size blocks and a free list stack to prevent memory fragmentation.
created: 2026-09-15
date: 2026-09-15
modified: 2026-09-15
lastmod: 2026-09-15
updated: 2026-09-15
last-modified: 2026-09-15
published: 2026-09-15
publishDate: 2026-09-15
---

# Introduction

One of my many projects that I work on from time to time is the [sstdlib](https://github.com/syswraith/sstdlib), which is a pure C implementation of common data structures that I use. The inspiration for this is [stb](https://github.com/nothings/stb) but built by me from the ground up. So I know exactly how it all works under the hood.

Last time, I implemented [[Dynamic and Heterogeneous Vectors in C]], which was a nice little exercise for it. The problem with this was that I was allocating this on the heap. I made it work with an [arena allocator](https://en.wikipedia.org/wiki/Region-based_memory_management) (which I implemented in [[Some more pointer magic with Memory Arenas]], by the way), but it still needs work. More specifically, I need to design a generic allocator interface for it to be able to use different types of allocation strategies—normal heap allocations, arena allocations, and what we are writing today—pool allocations.

# Difference between Arena Allocations and Pool Allocations

The terminology for these types of allocators is ambiguous. But for the purpose of this article, the difference is the following:

### Arena allocations may result in external fragmentation over time.

Say this is the initial memory layout of the memory arena

![[Pasted image 20260915190901.png]]

And say we don't need Segment 2, so we free it.

![[Pasted image 20260915190949.png]]

Now comes a problem. 

To fit another substantially large segment, we need to shift segment 3 and 4 to the left OR track the amount of space the new segment needs in order to fit in that memory. Either way, this is an expensive operation to perform. 

### Pool allocators provide fixed-size segments

Unlike arena allocators, pool allocators have their memory divided in fixed segments.

![[Pasted image 20260915191124.png]]

So if we free segment 2, then we can track it by pushing it onto a stack. The next operation that requires free memory, will pop off the segment from the top of the stack and use that. This makes sure that we don't have external fragmentation.

However, since the segments are of fixed size, we make a trade-off of internal fragmentation for knowing the size before allocation.

# Implementation

This is what the segment/block looks like. The next pointer points to the next block.

```c
typedef struct block_t {
    int data;
    struct block_t *next;
} Block;
```

This is the structure that tracks the pool allocator.

```c
typedef struct pool_t {
    Block *pool;
    Block *free_list; 
    size_t count;
    size_t pool_size;
} Pool;
```

These are the functions that we'll need.

```c
void pool_printer(Pool *pool);
Pool *pool_create(size_t pool_size);
Block *block_allocate(Pool *pool);
void block_free(Pool *pool, Block *block);
void pool_free(Pool *pool);
```

## Creating the pool

Here is what this function does in short:
- We specify the size of the pool.
- We allocate memory for it.
- The free list tracks all the free blocks (initially it contains all the blocks).
- `count` tracks the free blocks (initially the same as `pool_size`).

```c
Pool *pool_create(size_t pool_size)
{
    Pool *pool_ptr = malloc(sizeof(Pool));

    pool_ptr->pool = malloc(sizeof(Block) * pool_size);

    pool_ptr->free_list = NULL;

    for (size_t i = 0; i < pool_size; i++) {

        if (i == 0) {
            pool_ptr->pool[i].next = NULL;
            pool_ptr->free_list = &pool_ptr->pool[i];
            continue;
        }

        pool_ptr->pool[i].next = pool_ptr->free_list;

        pool_ptr->free_list = &pool_ptr->pool[i];
    }

    pool_ptr->count = pool_size;
    pool_ptr->pool_size = pool_size;

    return pool_ptr;
}

```

## Allocate block

- If `count` is 0, then there are no free blocks.
- Get the first free block (i.e. the head of the linked-list) and record it.
- Set the new head.
- Decrease the `count`. 
- Return the recorded address.

```c
Block *block_allocate(Pool *pool) 
{
    if (pool->count == 0) return NULL;

    Block *tmp = pool->free_list;
    pool->free_list = pool->free_list->next;
    pool->count--;

    return tmp;
}
```

## Free the block

- The first two operations are not necessary but specify the intent of the operation.
- Add the block to the free list (you can make it so that the same block isn't added twice by iterating through the whole thing, but I'm going to ignore that).
- Increase the count.

```c
void block_free(Pool *pool, Block *block)
{
    block->data = 0;
    block->next = pool->free_list;
    pool->free_list = block;
    pool->count++;
}
```

## Free the pool

- Free the pool memory that's allocated and then free the pool struct itself.
- Ideally, this will probably go on the stack in my implementation.
- The asserts are there because I don't want to do verbose error checking.

```c
void pool_free(Pool *pool)
{
    assert(pool != NULL);
    assert(pool->pool != NULL);

    pool->free_list = NULL;
    pool->count = 0;

    free(pool->pool);
    free(pool);
}
```

# Conclusion


This pool allocator is useful if I have vectors of fixed data types. 

That way it's easier to reallocate more space if necessary, and not worry about external fragmentation.

The source code can be found at [https://github.com/syswraith/pool_allocator](https://github.com/syswraith/pool_allocator).