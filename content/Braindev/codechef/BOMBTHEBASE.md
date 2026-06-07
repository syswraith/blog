---
title: BOMBTHEBASE
tag: codechef
---

[bombthebase](https://www.codechef.com/problems/BOMBTHEBASE)

# Program

````cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
	int T, N, X;
	cin >> T;
	while (T--)
	{
	    int ans = 0;
	    cin >> N >> X;
	    int arr[N];
	    for (int i = 0; i < N; i++) cin >> arr[i];
	    for (int j = N-1; j >= 0; j--)
	    {
	        if (arr[j] < X)
	        {
	            ans = (j+1);
	            break;
	        }
	    }
	    cout << ans << '\n';
	}
    return 0;
}
````

# Comments
