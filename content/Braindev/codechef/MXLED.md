---
title: MXLED
tags:
  - codechef
  - writeup
---

[MXLED](https://www.codechef.com/problems/MXLED)

# Logic

- cumulative means total after each round here.

# Program

```cpp
#include <bits/stdc++.h>
#include <cstdlib>
using namespace std;

int main() 
{
    int n{};
    cin >> n;

    int One{};
    int Two{};

    bool player{};
    int lead{};

    while (n--) {
        int one{};
        int two{};
        cin >> one >> two;
        One += one;
        Two += two;
        int cumulative = abs(One - Two);

        if (cumulative > lead) {
            // set new lead
            lead = cumulative;
            player = (One > Two);
        }
    }

    cout << ((player)?"1":"2") << " " << lead;

    return EXIT_SUCCESS;

}
```

# Comments

