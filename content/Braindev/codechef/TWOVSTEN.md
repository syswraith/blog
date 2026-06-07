---
title: TWOVSTEN
tag: codechef
---

[TWOVSTEN](https://www.codechef.com/problems/TWOVSTEN)

# Program

````cpp
#include <bits/stdc++.h>
using namespace std;

int main() 
{
    int T, X;
    cin >> T;
    while(T--)
    {
        cin >> X;
        if (X % 10 == 0) cout << 0;
        else if (X % 5 == 0) cout << 1;
        else cout << -1 ;
        cout << '\n';
    }
    return 0;
}
````

# Comments
