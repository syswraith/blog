---
title: Breaking a Substitution Cipher with Cryptanalysis
description: A step-by-step walkthrough of breaking a substitution cipher using frequency analysis, pattern recognition, and contextual guessing.
comments: true
lang: en
publish: false
draft: true
enableToc: true
tags:
  - hashing
  - probing
  - chaining
  - algorithms
  - data-structures
alias:
  - Breaking-a-Substitution-Cipher-with-Cryptanalysis
cssclasses: []
socialDescription: Learn how to break a substitution cipher using classic cryptanalysis techniques like frequency analysis, repeating patterns, and contextual deduction.
socialImage: substitution_cipher.png
created: 2025-10-27
date: 2025-10-27
modified: 2025-10-27
lastmod: 2025-10-27
updated: 2025-10-27
last-modified: 2025-10-27
published: 2025-10-27
publishDate: 2025-10-27
---



In my data structures and algorithms course, I had a topic which gave me a general overview on how hashing helps to store and retrieve data efficiently. Some of the concepts fascinated me and I decided to implement them for recreation.

Some basic terms that I'll be using in my explanation are:

| Terms         | Definitions                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Key           | An input.                                                                                                                        |
| Hashing       | The process of taking an input key and generating a parameter which is used to store the key.                                    |
| Hash Function | A function that is responsible for taking the key as input, processing it and providing an output that is used to store the key. |
| Bucket        | A place where the key is stored.                                                                                                 |
| Hash table    | A table which stores all of the buckets.                                                                                         |
| Bucket index  | An index or a reference to where the key is stored; or simply put, the address of the bucket in the hash table.                  |
| Collision     | When one or more keys (input) produce the same bucket index (output), a collision is said to occur.                              |
| Overflow      | When a hash table has reached the limit of how many keys it can store, adding any more elements will cause an overflow to occur. |
To resolve a collision, we use different collision resolution techniques. Four of them are:
- [[#Chaining]]
- Linear probing
- Quadratic probing
- Extendable hashing

# Chaining

### Important points to note:
- This type of technique uses linked lists to store keys. 
- When a collision occurs, one can simply add the incoming key to the linked list.
- This solution is able to dynamically store incoming keys without requiring us to manually resizing it.
- Each index of the hash table points to the head of the linked list that stores the most recent element of the bucket.
- Each element that is in the linked list points to the next element. If the current element is the last element, it will point to null.
### Visual representation

![[chaining.png]]
### C code

```C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_INDEX 10

typedef struct bucket_t {
  char *data;
  struct bucket_t *next;
} bucket;

typedef struct bucket_index_t {
  bucket *index_ptr;
} bucket_index;

bucket_index table[MAX_INDEX];

void initialize_table() {
  for (int i = 0; i < MAX_INDEX; i++)
    table[i].index_ptr = NULL;
}

void push_key(char *word) {
  char *key = malloc(strlen(word) + 1);
  strcpy(key, word);
  int key_length = strlen(key);
  int hash_value = key_length % MAX_INDEX;

  bucket *new_entry = malloc(sizeof(bucket));
  new_entry->data = key;
  new_entry->next = NULL;

  if (table[hash_value].index_ptr == NULL) {
    table[hash_value].index_ptr = new_entry;
  } else {
    bucket *tmp = table[hash_value].index_ptr;
    new_entry->next = tmp;
    table[hash_value].index_ptr = new_entry;
  }
}

void print_hash_table() {
  for (int i = 0; i < MAX_INDEX; i++) {
    printf("Index %d: ", i);
    bucket *head = table[i].index_ptr;
    while (head != NULL) {
      printf("%s ", head->data);
      head = head->next;
    }
    printf("\n");
  }
}

void delete_hash_table() {
  for (int i = 0; i < MAX_INDEX; i++) {
    bucket *head = table[i].index_ptr;
    while (head != NULL) {
      bucket *tmp = head->next;
      free(head->data);
      free(head);
      head = tmp;
    }
    table[i].index_ptr = NULL;
  }
}

int main() {

  int limit = 100;

  initialize_table();

  while (limit--) {
    char buff[100] = {0};
    scanf("%99s", buff);
    push_key(buff);
  }

  print_hash_table();
  delete_hash_table();

  return 0;
}
```
### Output

![[chaining_output.png]]
Since the hash function is `k % 10`, the index for 0 and 10 are the same, thus the leading spaces.

# Linear Probing

## C code

## Output