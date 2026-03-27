---
title: PASSORFAIL
tag: codechef
---

[PASSORFAIL](https://www.codechef.com/problems/PASSORFAIL)

# Program

```cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int T, N, X, P;
    cin >> T;
    while(T--)
    {
        cin >> N >> X >> P;
        cout << (((4*X - N) >= P)?"PASS":"FAIL") << '\n';
    }
    return 0;
}
```

# Comments
