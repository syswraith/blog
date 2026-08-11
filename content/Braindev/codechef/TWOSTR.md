
# [Problem](https://www.codechef.com/practice/course/strings/STRINGS/problems/TWOSTR)

# Code

```cpp
#include <bits/stdc++.h>

using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        string x, y;
        cin >> x >> y;
        bool found = true;

        for (int i = 0; i < x.size(); i++)
        {
            if (!(x[i] == y[i] || x[i] == '?' || y[i] == '?')) {
                found = false;
                break;
            }
        }
        
        cout << ((found) ? ("Yes\n") : ("No\n"));
    }

}
```

# Logic

If while looping through the characters of `x` and `y`:
- x is NOT equal to y
- x is NOT ?
- y is NOT ?
then the character is NOT found, and thus we can break out of the loop, else continue.