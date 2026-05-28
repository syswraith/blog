---
title: Some more pointer magic with Memory Arenas
description: Exploring memory arenas in C to simplify pointer management and avoid memory leaks.
comments: true
lang: en
publish: true
draft: false
enableToc: true
tags:
  - memory
  - arena
  - c
  - pointers
alias:
  - memory_arenas
cssclasses: []
socialDescription: A deep dive into memory arenas in C for efficient pointer handling and memory safety.
created: 2026-05-28
date: 2026-05-28
modified: 2026-05-28
lastmod: 2026-05-28
updated: 2026-05-28
last-modified: 2026-05-28
published: 2026-05-28
publishDate: 2026-05-28
---


I like implementing low-level things in C. It sort of helps me visualize how things work at a low memory level.

Consider the following example:

```c
int *p = malloc(3); 
````

This pointer now holds the first address of a contiguous memory block of three bytes.

![[123.png]]

Now this memory is allocated on the heap. It has to be freed eventually, else we'll end up with a memory leak.

## The Problem and the Solution

Keeping track of multiple pointers that need to be freed is hard.

Memory arenas provide a simple solution to this problem.

* Declare a contiguous memory block (arena) that is big enough to hold all the data you'll ever need.
* Use and reuse that memory block.
* If some data that has been allocated goes out of scope, make sure to dispose of it to regain memory available for use.
* Once everything is done, free that memory block.

This approach makes it possible for us to avoid having to call `free` multiple times. We only call it once when we are done with the program and no longer need to create pointers.

## The Implementation

We need 5 functions.

| Function        | Return Type | Parameters                                  | Description                                                                      |
| --------------- | ----------- | ------------------------------------------- | -------------------------------------------------------------------------------- |
| ArenaInitialize | (Arena *)   | (size_t size)                               | To initialize/allocate the memory arena                                          |
| ArenaAllocate   | (char *)    | (Arena *arena, size_t size, datatype value) | To allocate pointers on the memory arena                                         |
| ArenaPrinter    | void        | (Arena *arena, size_t size)                 | To print the contents of the memory arena                                        |
| ArenaReset      | void        | (Arena *arena)                              | To clear the memory arena (clear the pointers that we have previously allocated) |
| ArenaFree       | void        | (Arena *arena)                              | To deallocate the memory arena                                                   |

Now let's step through some code!

```c
typedef struct {
  size_t size;
  size_t currentOffset;
  char *buffer;
} Arena;
```

First, we have a struct that is used to initialize the Arena.

* The `size` member is used to store the size of the initialized struct (in bytes).
* The `currentOffset` is used to keep track of how much data has been written into the Arena. For example, if the Arena is storing 9 chars, then the `currentOffset` is 9 bytes (since every char is 1 byte).
* `buffer` stores the actual data. Note that it's a `char *` because `char` is 1 byte and that it is yet to be initialized.

```c
Arena *ArenaInit(size_t size) {

  // if size == 0 then return NULL
  if (!size) {
    return NULL;
  }

  // allocate the arena pointer
  Arena *arenaPtr = malloc(sizeof(Arena));

  // allocate the buffer to 1 byte (char) * number of elements (size)
  arenaPtr->buffer = calloc(size, sizeof(char));
  arenaPtr->size = size;
  arenaPtr->currentOffset = 0;

  return arenaPtr;
}
```

* While initializing the arena, we have to allocate the arena and then the buffer inside it. I've used `malloc` and `calloc` here, but it can be done with either of them.
* The arena's size is set to the `size` argument that is passed by the user. It's multiplied with `char` because `char` is usually 1 byte in size. It's also recorded in a variable.
* The `currentOffset` is set to 0. This is done to keep track of where we are when allocating space on the arena.
* Finally, the function returns a pointer to the initialized memory arena.

```c
char *ArenaAlloc(Arena *arena, size_t size, int value) {

  // if the arena offset is greater than or equal to the arena size then return
  // NULL
  if ((arena->currentOffset + size) > arena->size) {
    return NULL;
  }

  // get the current offset
  char *currentOffset = arena->buffer + arena->currentOffset;

  // set the value and increment the offset
  memcpy(currentOffset, &value, size);
  arena->currentOffset += size;

  // return the current offset
  return currentOffset;
}
```

After we are done initializing and allocating memory to the arena, we can now allocate space on it.

* First, we check if the current offset will exceed the arena's size when more data is added to it. If it does, then we return `NULL`, in which case allocating memory on the arena has failed.
* Then we get the current offset pointer. This is done using pointer arithmetic, where we add the integer size of the current offset to `arena->buffer`. Notice that `arena->buffer` is a pointer itself, and when referenced, it decays to a pointer to the first element.
* Now we copy data after the current offset with `memcpy`.
* We update the current offset by adding the size of the data copied to the arena.
* Finally, we return the current offset. Notice that this is the offset that shows the beginning of the allocated data and not the current offset of the memory arena.

```c
void ArenaPrinter(Arena *arena, size_t size) {

  size_t currentOffset = arena->currentOffset;
  size_t counter = 0;

  if (arena->currentOffset == 0) {
    fprintf(stderr, "Error: Arena is empty");
    exit(1);
  }

  while (counter != currentOffset) {
    printf("%d\n", *(arena->buffer + counter));
    counter += size;
  }
}
```

* This is a function that prints the contents of the memory arena. It's purely for debugging purposes.

```c
void ArenaReset(Arena *arena) {
  // clear the buffer
  memset(arena->buffer, 0, arena->size);

  // reset the current
  arena->currentOffset = 0;
}
```

* Say we want to remove the allocated data. Normally we would do this with `free`, but since we are using an arena, we can just overwrite the whole arena with `0` (or not, but this seems cleaner, like `calloc`) and reset the current offset of the arena to 0.

```c
void ArenaFree(Arena *arena) {
  // first free the buffer in arena
  free(arena->buffer);

  // then free the arena itself
  free(arena);
}
```

* While freeing the arena, it's very important that we first free the buffer inside the arena and then the arena itself. If we free the arena first, the pointer to the buffer will be lost and this will result in a memory leak.

## Conclusion

And that's it. A clean, simple and memory-safe solution for allocating and deallocating pointers in pure C :)