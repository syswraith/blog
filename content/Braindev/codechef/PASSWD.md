---
title: PASSWD
tags:
  - codechef
  - writeup
---
# Problem
[PASSWD](https://www.codechef.com/practice/course/strings/STRINGS/problems/PASSWD)

# Code
```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
	
	size_t t{};
	cin >> t;
	
	while (t--) {
	    string password;
	    cin >> password;
	    bool isNum = false;
	    bool isUpper = false;
	    bool isLower = false;
	    bool isSpecial = false;
	    
	    // length check
	    if (!(password.size() >= 10)) {
	        cout << "NO\n";
	        continue;
	    }
	    
	    
	    for (int j = 0; j < password.size(); j++) {
	        
	        char i = password[j];
	        bool isIn = !(j == 0 || j == password.size() - 1);
	        
	        if (i >= 'a' && i <= 'z') {
	            isLower = true;
	            continue;
	        } else if (isIn && (i >= 'A' && i <= 'Z')) {
	            isUpper = true;
	            continue;
	        } else if (isIn && (i == '@' || i == '#' || i == '%' || i == '&' || i == '?')) {
	            isSpecial = true;
	            continue;
	        } else if (isIn && (i >= '0' && i <= '9')) {
	            isNum = true;
	            continue;
	        } else {
	            continue;
	        }
	        
	    }
	    
	    cout << ((isNum && isUpper && isLower && isSpecial)?"YES\n":"NO\n");
	    
	    
	    
	}

}

```

# Logic

- `checkLength` and `isIn` are the only two important checks.
- `checkLength` will check the length requirement which is the single check that we can perform without doing any other checks. If it's not satisfied, we can output no right away and continue to the next testcase.
- `isIn` will check each `j` and determine if it's `0` (start) or `password.size() - 1` (end) and then is AND'ed with the other conditions in a short circuit manner.