---
title: LOCKDRAW
tag: codechef
---

[LOCKDRAW](https://www.codechef.com/problems/LOCKDRAW)

# Program

````cpp
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int T;
    cin >> T;
    while (T--)
    {
        vector<int> arr(3);
        for (int i = 0; i < 3; i++) cin >> arr[i];
        int greatest = *max_element(arr.begin(), arr.end());
        cout << ((arr[0]+arr[1]+arr[2]-greatest == greatest)?"YES":"NO") << '\n';
    }
    return 0;
}
````

# Comments
