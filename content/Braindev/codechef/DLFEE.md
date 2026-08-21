---
title: DLFEE
tags:
  - codechef
  - writeup
---

[DLFEE](https://www.codechef.com/problems/DLFEE)

# Program

```cpp
#include <bits/stdc++.h>

using namespace std;

int main()
{
    int a, b, k;
    cin >> a >> b >> k;

    int fee = b;

    if (a >= k) {
        fee = 0;
    }
    
    cout << (a + fee) << '\n';

    return EXIT_SUCCESS;

}
```

# Comments

