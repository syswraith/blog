---
title: PALINDRCHECK
tag: codechef
---

[PALINDRCHECK](https://www.codechef.com/problems/PALINDRCHECK)

# Program

```cpp
string reverseWords(string s) 
{
    // the stringstream class initialized with the string
    stringstream stream(s);
    
    // vector to hold the tokens
    vector<string> vec;
    
    // tmp and result
    string temp;
    string result;
    
    // getline takes characters and appends it to the tmp until delim is encountered
    while (getline(stream, temp, ' '))
        vec.push_back(temp);
    
    
    for (int i = vec.size() - 1; i >= 0; --i)
    {
        if (vec[i] == "") continue;
        result += vec[i] + ((i != 0)?" ":"");
    }
    
    return result;
}
```

# Comments

- the stringstream class initialized with the string
- vector to hold the tokens
- tmp and result
- getline takes characters and appends it to the tmp until delim is encountered
