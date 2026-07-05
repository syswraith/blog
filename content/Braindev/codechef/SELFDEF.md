---
title: SELFDEF
tag: codechef
---

[SELFDEF](https://www.codechef.com/problems/SELFDEF)

# Program

````cpp
#include <bits/stdc++.h>
using namespace std;

int main() 
{
    int T, N, woman;
    cin >> T;
    while (T--)
    {
        cin >> N;
        int counter = 0;
        while (N--)
        {
            cin >> woman;
            if (woman < 61 && woman > 9) counter++;
        }
        cout << counter << '\n';
    }
    return 0;
}
````

# Comments
