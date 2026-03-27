---
title: RECTSQ
tag: codechef
---

[RECTSQ](https://www.codechef.com/problems/RECTSQ)

# Program

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int T, M, N;
    cin >> T;
	while(T--)
	{
	    cin >> M >> N;
        cout << ((M*N)/( gcd(M,N)*gcd(M,N) )) << '\n';
	}

}
```

# Comments
