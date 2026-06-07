---
title: WCC
tag: codechef
---

[WCC](https://www.codechef.com/problems/WCC)

# Program

````cpp
#include <bits/stdc++.h>
using namespace std;

int main() 
{
    int T, X;
    char S;
    cin >> T;
    while (T--)
    {
        cin >> X;
        int carlsen = 0;
        int chef = 0;
        int cc;
        for (int i = 0; i < 14; i++)
        {
            cin >> S;
            if (S == 'C') { carlsen += 2; }
            else if (S == 'N') { chef += 2; }
            else 
            {
                carlsen++;
                chef++;
            }
        }
        
        if (carlsen > chef) { cc = 60 * X; }
        else if (chef > carlsen) { cc = 40 * X; }
        else { cc = 55 * X; }
        
        cout << cc << '\n';
    }
}
````

# Comments
