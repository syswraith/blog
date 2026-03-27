---
title: LASTLEVELS
tag: codechef
---

[LASTLEVELS](https://www.codechef.com/problems/LASTLEVELS)

# Program

```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int T, X, Y, Z;
    cin >> T;
    while (T--)
    {
        cin >> X >> Y >> Z;
        int total_time = ((X*Y) + ((X / 3) * Z));
        if (X % 3 == 0) total_time -= Z;
        cout << total_time << '\n';
    }
}
```

# Comments
