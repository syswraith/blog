---
title: MISSP
tag: codechef
---

[MISSP](https://www.codechef.com/problems/MISSP)

# Program

```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int T, N, type, tracker;
    cin >> T;
    while (T--)
    {
        tracker = 0;
        cin >> N;
        while (N--)
        {
            cin >> type;
            tracker ^= type;
        }
        cout << tracker << '\n';
    }

    return 0;
}
```

# Comments
