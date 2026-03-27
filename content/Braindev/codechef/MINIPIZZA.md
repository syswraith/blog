---
title: MINIPIZZA
tag: codechef
---

[MINIPIZZA](https://www.codechef.com/problems/MINIPIZZA)

# Program

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
	// your code goes here
	int T, N, X;
	cin >> T;
	while (T--)
	{
	    cin >> N >> X;
	    cout << ( (N * X + 3) / 4 ) << '\n';
	    // a/b floors down so we add (b-1) to ceil up so when it floors down it floors down right
	}
	return 0;
}
```

# Comments

- your code goes here
- a/b floors down so we add (b-1) to ceil up so when it floors down it floors down right
