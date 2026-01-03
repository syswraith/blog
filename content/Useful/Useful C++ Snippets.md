# Common methods for almost all containers

- `int .size()`
- `bool .empty()`
- `void .clear()`
- `void .swap(type another_container)`

# Vector methods

- `itr .begin()`
- `itr .end()`
- `void .push_back(type element)`
- `type .at(int index)`
- `void .erase(itr)`

# Deque

- all methods of vectors
- `void .push_front(type element)`

# List (linked list)

- same as Deque
- `itr .find(cont.begin(), cont.end(), type value)`
- `void .insert(itr, type value)` insert element before itr element (for after itr probably do ++itr)

# Doubly linked list

- all methods of linked list
- `void .splice(itr_to_insert_before, existing_list, itr_1_of_existing, itr_2_of_existing)`
  inserts elements of existing list in range of the iterators into the doubly linked list that its called from
