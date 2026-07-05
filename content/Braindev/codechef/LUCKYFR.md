---
title: LUCKYFR
tag: codechef
---

[LUCKYFR](https://www.codechef.com/problems/LUCKYFR)

# Program

````cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int T, D, C;
	cin >> T;
	while (T--)
	{
	    C = 0;
	    cin >> D;
	    while (D > 0)
	    {
	        if (D % 10 == 4) C++;
	        D /= 10;
	    }
	    cout << C << '\n';
	}
	return 0;
}
````

# Comments
