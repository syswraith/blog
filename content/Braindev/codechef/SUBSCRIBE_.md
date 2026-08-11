---
title: SUBSCRIBE_
tags:
  - codechef
  - writeup
---

[SUBSCRIBE\_](https://www.codechef.com/problems/SUBSCRIBE_)

# Program

````cpp
#define READ_T 1
#include <bits/stdc++.h>
using namespace std;

#define ll long long
#define int ll
#define ull unsigned long long
#define ld long double
#define rep(i,a,b) for (long long i = (a); i < (b); i++)
#define endl '\n'
#define fastio ios::sync_with_stdio(0); cin.tie(0)

/*   
   .▄▄ ·  ▄· ▄▌.▄▄ · ▄▄▌ ▐ ▄▌▄▄▄   ▄▄▄· ▪  ▄▄▄▄▄ ▄ .▄
   ▐█ ▀. ▐█▪██▌▐█ ▀. ██· █▌▐█▀▄ █·▐█ ▀█ ██ •██  ██▪▐█
   ▄▀▀▀█▄▐█▌▐█▪▄▀▀▀█▄██▪▐█▐▐▌▐▀▀▄ ▄█▀▀█ ▐█· ▐█.▪██▀▐█
   ▐█▄▪▐█ ▐█▀·.▐█▄▪▐█▐█▌██▐█▌▐█•█▌▐█ ▪▐▌▐█▌ ▐█▌·██▌▐▀
    ▀▀▀▀   ▀ •  ▀▀▀▀  ▀▀▀▀ ▀▪.▀  ▀ ▀  ▀ ▀▀▀ ▀▀▀ ▀▀▀ ·
           "Magic blooms only in rare souls"  
*/

void solve() 
{
    int N{}, X{};
    cin >> N >> X;
    cout << ( (N <= 6) ? X : (X * ((N+5)/6)) );
}

#undef int
int main()
{

#define int long long
    fastio;
    int T{};

#if READ_T
    cin >> T;
#else
    T = 1;
#endif

    while (T--)
    {
        solve();
        cout << endl;
    }

    return 0;
}
````

# Comments

* .▄▄ ·  ▄· ▄▌.▄▄ · ▄▄▌ ▐ ▄▌▄▄▄   ▄▄▄· ▪  ▄▄▄▄▄ ▄ .▄
* ▐█ ▀. ▐█▪██▌▐█ ▀. ██· █▌▐█▀▄ █·▐█ ▀█ ██ •██  ██▪▐█
* ▄▀▀▀█▄▐█▌▐█▪▄▀▀▀█▄██▪▐█▐▐▌▐▀▀▄ ▄█▀▀█ ▐█· ▐█.▪██▀▐█
* ▐█▄▪▐█ ▐█▀·.▐█▄▪▐█▐█▌██▐█▌▐█•█▌▐█ ▪▐▌▐█▌ ▐█▌·██▌▐▀
* ▀▀▀▀   ▀ •  ▀▀▀▀  ▀▀▀▀ ▀▪.▀  ▀ ▀  ▀ ▀▀▀ ▀▀▀ ▀▀▀ ·
* "Magic blooms only in rare souls"
