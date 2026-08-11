---
title: Dynamic and Heterogeneous Vectors in C
description: Implementing a std::vector equivalent in C with dynamic resizing and support for heterogeneous data types using tagged unions.
comments: true
lang: en
publish: true
draft: false
enableToc: true
tags:
- c
- vectors
- tagged-unions
- dynamic-array
- data-structures
- systems-programming
- memory-management
alias:
- dynamic_vectors
cssclasses: []
socialDescription: Implementing a std::vector in C with dynamic resizing and heterogeneous data types using tagged unions and stdlib algorithms.
created: 2026-08-11
date: 2026-08-11
modified: 2026-08-11
lastmod: 2026-08-11
updated: 2026-08-11
last-modified: 2026-08-11
published: 2026-08-11
publishDate: 2026-08-11
---

`std::vector` is a very useful container with dynamic resizing upon insertion and deletion. I wanted to understand how it worked better, so I decided to implement it in C. Furthermore, I wanted to make it so that I can store multiple data types, kind of like a **Python List**.

TL;DR of how and what I implemented:
- Tagged union to handle different data types
- Realloc under the hood based on how big or small the vector is getting
- Searching and sorting with built-in `stdlib.h` functions

# Tagged unions

```c
typedef enum tag {
    BOOL,
    CHAR,
    INT,
    FLOAT,
    DOUBLE,
    STRING,
    ANY
} Tag;

typedef struct {
    enum tag tag;
    union {
        bool b;
        char c;
        int i;
        float f;
        double d;
        String s;
    } value;
} Dynamic;
```

(The `String` datatype is my implementation of *string views* following [Tsoding's C strings stream](https://youtu.be/y8PLpDgZc0E), but ignore that part. Just thought I'd mention it once since it may show up in the code later.)

So a tagged union. It's a nice way to get dynamic typing in C if you're not strapped for memory. 
- An enumeration is used to keep track of all the datatypes that we are using. If no value is specified, then the enumeration starts from 0 and continues incrementally.
- A union confuses a lot of people. Think of it as an instrument that is used to view content stored at a memory location through the lens of different datatypes. 
- This means that we can view a piece of `n-bit signed` memory content as `n-bit unsigned` memory or even another different datatype.
- The size of the union is calculated by finding out the largest datatype listed in the union. This makes sure that we can store whichever datatype we want in the struct that we have just created.
- The memory of the struct is strictly defined by its enum value, and the value stored is strictly in the type of the data type defined. For example:

```c
Dynamic integer = (Dynamic) { .tag = INT, .value.i = 10.10 };
// this will explicitly store 10 as an integer, ignoring the floating part
integer.tag = FLOAT;
// this will return 1092721050 when printed 
// because the value was not stored as a float 
// floats use IEEE 754 to store their values
// It tried to interpret the underlying memory as described in IEEE 754 and got this result
```

## 1. Printing this would require a function such as this

```c
void Generic_printer(Dynamic element) 
{

    switch (element.tag) {
        case BOOL: 
            printf("%s", (element.value.b)?"true":"false" );
            break;
        case CHAR:
            printf("%c", element.value.c);
            break;
        case FLOAT: 
            printf("%f", (element.value.f));
            break;
        case DOUBLE:
            printf("%lf", (element.value.d));
            break;
        case INT: 
            printf("%i", (element.value.i));
            break;
        case STRING:
            String_print(&element.value.s);
            break;
        case ANY:
            break;
    }
    
}
```

## 2. Comparer

Now this is a strange function. But it's useful for a multitude of other functions that use it.
All it does is:
- Take in `void` pointers to the elements whose types are not known.
- Cast them to `Dynamic` elements and copy them into `arg1` and `arg2`.
- Get the tags of the elements (since while passing the elements to this function, the elements are already `Dynamic` so the casting is more like encoding and decoding).
- Return `-1` if `arg1` is less than `arg2`, `1` if `arg1` is greater than `arg2`, else `0` if they are equal.
- Doesn't work on non-numeric types of data (yet). 

```c
int Tagged_comparer(const void *a, const void *b) 
{
    Dynamic arg1 = *(const Dynamic *)a;
    Dynamic arg2 = *(const Dynamic *)b;
    Tag tag = arg1.tag;
    
    switch (tag) {
        case BOOL: 
            if (arg1.value.b < arg2.value.b) return -1;
            if (arg1.value.b > arg2.value.b) return 1;
            break;
        case CHAR:
            if (arg1.value.c < arg2.value.c) return -1;
            if (arg1.value.c > arg2.value.c) return 1;
            break;
        case FLOAT: 
            if (arg1.value.f < arg2.value.f) return -1;
            if (arg1.value.f > arg2.value.f) return 1;
            break;
        case DOUBLE:
            if (arg1.value.d < arg2.value.d) return -1;
            if (arg1.value.d > arg2.value.d) return 1;
            break;
        case INT: 
            if (arg1.value.i < arg2.value.i) return -1;
            if (arg1.value.i > arg2.value.i) return 1;
            break;
        case STRING:
        case ANY:
            break;
    }


    return 0;
}
```

Now we have a dynamic typing system in place. Let's move on to making a vector!
# Vector

- O(1) access to elements
- Automatic resizing of elements
- Push and pop from the end
- Sorting the vector
- Finding an element and its index

```C
typedef struct vector {
    Dynamic *vector;
    size_t counter;
    size_t size;
    Tag type;
    bool isSorted;
} Vector;
```

- `vector` is a pointer to the start of the memory allocated
- `counter` defines how many elements are actually present in the vector
- `size` defines the total available size of the vector
- `type` defines the type of the vector (can be any of the types from the tagged union)
- `isSorted` checks if the vector is sorted

## 1. Let's create and free the vector first

```c
Vector *Vector_create(size_t size, Tag type)
// function returns a pointer to a Vector
// with the specific size and type
{
    Vector *v = malloc(sizeof(Vector));
    // allocate memory size of a vector

    v->size = size;
    // total size given by the user
    
    v->counter = 0;
    // since no places are filled
    
    v->type = type;
    // type given by the user
    
    v->isSorted = false;
    // is not sorted by default
    
    v->vector = calloc(v->size, sizeof(Dynamic));
    // allocates memory for v->size elements of type Dynamic

    return v;
}


void Vector_dealloc(Vector *v)
{
    free(v->vector);
    // free the allocated memory internally first
    
    free(v);
    // free the vector
}

```

## 2. Pushing and popping elements from the back

```c
void Vector_pushBack(Vector *v, Dynamic element) 
{
    if (v->type != element.tag && v->type != ANY) {
        fprintf(stderr, "Tried inserting type %s in vector of type %s\n", Tagged_string(element.tag), Tagged_string(v->type));
        return;
    }

    if (v->counter == v->size) {
        v->size += v->size;
        v->vector = realloc(v->vector, sizeof(Dynamic) * v->size);
    }

    if (v->isSorted && v->counter > 0 && Tagged_comparer(&v->vector[v->counter - 1], &element) > 0) {
        v->isSorted = false;
    }

    v->vector[v->counter] = element;
    v->counter++;
}
```

- If the type is not `ANY` and the type of the element to be inserted does not match the type of the vector, then throw an error.
- If the counter is the same as the size of the vector, then we are going to overwrite into memory that does not exist, which will lead to *undefined behavior*. So double the allocated memory and realloc it.
- Check if the vector was sorted first and the counter was greater than 0. Also check if the Tagged comparer returns 1. That way we know if the element is greater than or equal to the last element. If it wasn't, then on adding it to the end, the vector will no longer be sorted.
- Finally, assign the element to the counter position and increment the counter.

```c
Dynamic Vector_popBack(Vector *v) 
{

    if (v->counter == 0) {
        fprintf(stderr, "Vector underflow\n");
        exit(EXIT_FAILURE);
    }

    v->counter--;
    Dynamic element = v->vector[v->counter];

    if (v->counter < (v->size / 2)) {
        v->size /= 2;
        v->vector = realloc(v->vector, sizeof(Dynamic) * v->size);
    }

    return element;
}
```

- Check for stack underflow. If it's happening, error and die.
- Decrease the counter and capture the element.
- Before returning the element, check if the counter is less than half the size of the vector. If it is, decrease the size of the vector by reallocating to the reduced size.
- Finally, return the element.

## 3. Sorting the vector and finding elements

Believe it or not, `stdlib.h` has built-in Quick Sort and Binary Search. It is the reason why we had to write the `Tagged_comparer` in the first place.

```c
void Vector_sort(Vector *v)
{
    if (v->type == ANY || v->type == STRING) {
        fprintf(stderr, "Can't sort vector of type %s\n", Tagged_string(v->type));
        return;
    }

    if (v->isSorted) {
        fprintf(stderr, "Already sorted\n");
        return;
    }

    qsort(v->vector, v->counter, sizeof(Dynamic), Tagged_comparer);
    v->isSorted = true;

}
```

And for the searching part

```c
Dynamic *Vector_findElement(Vector *v, Dynamic target)
{
    if (!v->isSorted) {
        fprintf(stderr, "Error: Vector must be sorted before performing binary search.\n");
        exit(EXIT_FAILURE);
    }

    // if null then doesn't exist
    return bsearch(&target, v->vector, v->counter, sizeof(Dynamic), Tagged_comparer);
}

int Vector_findIndex(Vector *v, Dynamic target)
{
    Dynamic *result = Vector_findElement(v, target);
    if (result == NULL) {
        return -1;
    }
    // Calculate index using pointer arithmetic
    return (int)(result - v->vector);
}
```

And there we have it. 
A dynamic, heterogeneous vector in C.