# Problem
### [Neck](https://www.codechef.com/practice/course/stacks-and-queues-new/STACKQUE06/problems/NEC)

# Program 

```cpp
#include <bits/stdc++.h>

using namespace std;

int main()
{

    size_t t{};
    cin >> t;

    while (t--) {
        int n, k;
        cin >> n >> k;
        vector<int> vec(n);
        vector<int> rot(n);

        for (int i = 0; i < n; i++) cin >> vec[i];

        for (int i = 0; i < n; i++) {
            rot[(i - k + n) % n] = vec[i];
        }

        for (int i = 0; i < n; i++) cout << " " << rot[i];
        cout << endl;


    }

    return EXIT_SUCCESS;
}
```

# Logic

- Made me realise that this can be treated as a queue
- But it can be treated as a rotating array problem
